import axios from 'axios';
import find from 'lodash.find';

export interface ItemApiResponse {
  itemId: number;
  name: string;
  uniqueName: string;
  icon: string;
  tags: string[];
  requiredLevel: number;
  itemLevel: number;
  sellPrice: number;
  vendorPrice: number;
  itemLink: string;
  tooltip: Record<'label' | 'format', string>[];
}

type SearchApiResponse = {
  itemId: number;
}[];

class ItemCache {
  cache: Record<string, ItemApiResponse>;

  constructor(cache: Record<string, ItemApiResponse> = {}) {
    this.cache = cache;
  }
  async search(name: string) {
    const existing = find(this.cache, ['name', name]);
    if (existing) {
      return existing;
    }

    const response = await axios.get<SearchApiResponse>(
      `https://api.nexushub.co/wow-classic/v1/search?query=${name}&limit=1`
    );

    const {itemId} = response.data[0];

    return this.get(itemId);
  }

  async get(id: number) {
    if (id in this.cache) {
      return this.cache[id];
    }

    const response = await axios.get<ItemApiResponse>(
      `https://api.nexushub.co/wow-classic/v1/item/${id}`
    );

    this.cache[id] = response.data;

    return this.cache[id];
  }
}

export default ItemCache;
