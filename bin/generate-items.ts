import meow from 'meow';
import ItemCache, {ItemApiResponse} from '../lib/itemCache';
import parse from 'csv-parse/lib/sync';
import * as getStream from 'get-stream';
import * as fs from 'async-file';
import getStdin from 'get-stdin';
import path from 'path';
import {mapSeries} from 'async';
import {classify} from '../lib/classify';

const cli = meow(``, {
  flags: {
    cacheFile: {
      type: 'string',
      default: 'itemCache.json',
      required: true,
    },
    lootFile: {
      type: 'string',
      default: 'loot.csv',
      required: true,
    },
    listIds: {
      type: 'string',
      required: true,
    },
  },
});

interface Output {
  cfliter: string;
  ilink: string;
  list: string;
}

(async () => {
  const cacheFile = path.join(__dirname, '../', cli.flags.cacheFile);
  const lootFile = path.join(__dirname, '../', cli.flags.lootFile);

  const data = await getStream.buffer(fs.createReadStream(cacheFile), {encoding: 'utf8'});
  const existingCache: Record<string, ItemApiResponse> = JSON.parse(data.toString());
  const itemCache = new ItemCache(existingCache);

  const lootData = await fs.readFile(lootFile);
  const records: Record<string, string>[] = parse(lootData, {
    columns: ['list', 'name'],
    relax_column_count: true,
  });

  const listMappings: Record<string, string> = (cli.flags.listIds as string)
    .split(',')
    .reduce((memo, l: string) => {
      const mapping = l.split('=');
      return {...memo, [mapping[0]]: mapping[1]};
    }, {});

  const mapped: [string, Output][] = await mapSeries(records, async ({list, name}) => {
    if (!listMappings[list]) {
      return [];
    }

    const item = await itemCache.search(name);
    const cfilter = classify(item.tags, item.tooltip);

    return [
      item.itemId,
      {
        cfilter,
        ilink: item.itemLink,
        list: listMappings[list],
      },
    ];
  });

  const items: Record<string, Output> = mapped
    .filter((m) => m.length > 0)
    .reduce((memo, [itemId, item]) => {
      return {
        ...memo,
        [itemId]: item,
      };
    }, {});

  if (Object.keys(items).length > 0) {
    const output = JSON.stringify(items);
    console.log(output);
  }
})();
