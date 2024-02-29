import * as path from 'path';

import { Naming } from './src/types/naming';
import { Parser } from './src/parser';
import { Struct } from './src/struct';
import { Repository } from './src/repository';

const filePath = path.resolve(__dirname, 'resources', 'naming_cmo.xlsx');

(async function main(path: string) {
  const data: Naming[] = await Parser.read(path, 1);
  const struct: Map<string, Naming[]> = await Struct.parse(data);

  const repo = new Repository();
  await repo.write(struct);
})(filePath);
