import meow from 'meow';
import ItemCache, {ItemApiResponse} from '../lib/itemCache';
import parse from 'csv-parse/lib/sync';
import * as getStream from 'get-stream';
import * as fs from 'async-file';
import getStdin from 'get-stdin';
import path from 'path';
import {eachSeries} from 'async';

const cli = meow(``, {
  flags: {
    cacheFile: {
      type: 'string',
    },
    lootFile: {
      type: 'string',
      default: 'loot.csv',
    },
    force: {
      type: 'boolean',
      default: false,
    },
  },
});

(async () => {
  let data: Buffer | '' = '';

  const cacheFile = path.join(__dirname, '../', cli.flags.cacheFile);
  const lootFile = path.join(__dirname, '../', cli.flags.lootFile);

  if (!cli.flags.force) {
    if (cacheFile) {
      const exists = await fs.exists(cacheFile);
      if (exists) {
        data = await getStream.buffer(fs.createReadStream(cacheFile), {encoding: 'utf8'});
      }
    } else {
      data = await getStdin.buffer();
    }
  }

  const existingCache: Record<string, ItemApiResponse> = data.length
    ? JSON.parse(data.toString())
    : {};

  const itemCache = new ItemCache(existingCache);

  const lootData = await fs.readFile(lootFile);

  const records = parse(lootData, {
    columns: ['list', 'name'],
    relax_column_count: true,
  });

  await eachSeries(records, async ({name}: Record<string, string>) => {
    console.log('Searching for', name);
    await itemCache.search(name);
  });

  if (Object.keys(itemCache.cache).length > 0) {
    const output = JSON.stringify(itemCache.cache);

    if (cli.flags.cacheFile) {
      fs.writeTextFile(cacheFile, output);
    } else {
      console.log(output);
    }
  }
})();
