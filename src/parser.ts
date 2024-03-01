import * as fs from 'node:fs/promises';
import * as ExcelJS from 'exceljs';

import { Naming } from './types/naming';

async function canAccess(path: string): Promise<boolean> {
  try {
    const { access, constants } = fs;
    await access(path, constants.R_OK | constants.W_OK);

    return true;
  } catch (error) {
    console.error(`File ${path} can't be opened:`, error);
    return false;
  }
}

async function getTable(
  path: string,
  table: number = 0
): Promise<ExcelJS.Worksheet> {
  const workbook: ExcelJS.Workbook = new ExcelJS.Workbook();

  const content = await workbook.xlsx.readFile(path);
  return content.worksheets[table];
}

function getCell(row: ExcelJS.Row, cellIndex: number) {
  const cell: ExcelJS.Cell = row.getCell(cellIndex);

  return cell.value ? cell.value.toString() : '';
}

async function getContent(
  table: ExcelJS.Worksheet,
  startIndex: number = 2
): Promise<Naming[]> {
  // NOTE: Start index in ExcelJS is 1
  const amount = table.rowCount - 1;

  const rows = table.getRows(startIndex, amount) ?? [];
  const formatted = rows.map((row): Naming => {
    return {
      page: getCell(row, 1),
      topic: getCell(row, 2),
      language: getCell(row, 3),
      text: getCell(row, 4),
      value: getCell(row, 5),
    };
  });

  return formatted.filter((row) => row.page);
}

export default async function read(
  path: string,
  page: number = 0
): Promise<Naming[]> {
  if (!(await canAccess(path))) return [];

  const table: ExcelJS.Worksheet = await getTable(path, page);

  return (await getContent(table)) ?? [];
}
