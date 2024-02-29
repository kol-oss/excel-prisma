import { Language, PrismaClient, Text } from '@prisma/client';

import { Naming } from './types/naming';

export class Repository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async write(data: Map<string, Naming[]>) {
    let currentTopicId: string | null = null;
    let order = 1;

    const values: Naming[] = Array.from(data.values()).flat();

    for (const item of values) {
      console.log(item);
      if (!item.text) {
        currentTopicId = null;
        order = 1;
      }

      const page: Text = await this.prisma.text.create({
        data: {
          page: item.page,
          topic: item.topic,
          language: (item.language as Language) ?? 'en',
          value: item.value,
          type: 'HTML',
          order: order++,
          textId: currentTopicId,
        },
      });

      if (!item.text) currentTopicId = page.id;
    }
  }
}
