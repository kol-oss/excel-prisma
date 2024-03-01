import * as path from 'path';

import { Naming } from './src/types/naming';
import read from './src/parser';
import parse from './src/struct';
import write from './src/repository';

const filePath = path.resolve(__dirname, 'resources', 'naming_cmo.xlsx');

(async function main(path: string) {
  for (let i = 0; i < 19; i++) {
    const data: Naming[] = await read(path, i);
    const struct: Map<string, Naming[]> = parse(data);

    await write(struct);
    console.log(`Successfully parsed page #${i + 1}`);
  }
})(filePath);
