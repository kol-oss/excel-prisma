import { Language, PrismaClient, Text } from '@prisma/client';

import { Naming } from './types/naming';

function getItemType(item: Naming) {
  if (item.topic === 'img') return 'IMG';
  if (item.value?.startsWith('/')) return 'URL';

  return 'HTML';
}

const prisma = new PrismaClient();

export class Repository {
  static async write(data: Map<string, Naming[]>) {
    let currentTopicId: string | null = null;
    let order = 1;

    const values: Naming[] = Array.from(data.values()).flat();

    for (const item of values) {
      if (!item.text) currentTopicId = null;

      const page: Text = await prisma.text.create({
        data: {
          page: item.page,
          topic: item.topic,
          language: (item.language as Language) ?? 'uk',
          value: item.value,
          type: getItemType(item),
          order: order++,
          textId: currentTopicId,
        },
      });

      if (!item.text) currentTopicId = page.id;
    }
  }
}
