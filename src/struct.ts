import { Naming } from './types/naming';

export class Struct {
  static parse(data: Naming[]): Map<string, Naming[]> {
    const map = new Map<string, Naming[]>();

    for (const item of data) {
      const { text } = item;
      if (!text) continue;

      if (map.has(text)) {
        map.get(text)?.push(item);
      } else {
        const highPage = {
          page: item.page,
          topic: text,
          language: item.language,
          text: null,
          value: null,
        };

        map.set(text, [highPage, item]);
      }
    }
    return map;
  }
}
