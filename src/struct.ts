import { Naming } from './types/naming';

export class Struct {
  private static formMapKey(topic: string, language: string) {
    return `${topic}-${language}`;
  }
  static parse(data: Naming[]): Map<string, Naming[]> {
    const map = new Map<string, Naming[]>();

    for (const item of data) {
      const { text, language } = item;
      if (!text) continue;
      if (item.value === 'null') item.value = null;

      const key = this.formMapKey(text, language);
      if (map.has(key)) {
        map.get(key)?.push(item);
      } else {
        const highPage = {
          page: item.page,
          topic: text,
          language: item.language,
          text: null,
          value: null,
        };

        map.set(key, [highPage, item]);
      }
    }
    return map;
  }
}
