import * as path from 'path';

import { Naming } from './src/types/naming';
import { Parser } from './src/parser';
import { Struct } from './src/struct';
import { Repository } from './src/repository';

const filePath = path.resolve(__dirname, 'resources', 'naming_cmo.xlsx');

(async function main(path: string) {
  for (let i = 0; i < 19; i++) {
    const data: Naming[] = await Parser.read(path, i);
    const struct: Map<string, Naming[]> = Struct.parse(data);

    await Repository.write(struct);
    console.log(`Successfully parsed page #${i + 1}`);
  }
})(filePath);
