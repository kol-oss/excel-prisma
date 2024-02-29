import * as fs from 'node:fs/promises';
import * as ExcelJS from 'exceljs';

import { Naming } from './types/naming';

export class Parser {
  private static async canAccess(path: string): Promise<boolean> {
    try {
      const { access, constants } = fs;
      await access(path, constants.R_OK | constants.W_OK);

      return true;
    } catch (error) {
      console.error(`File ${path} can't be opened:`, error);
      return false;
    }
  }

  private static async getTable(
    path: string,
    table: number = 0
  ): Promise<ExcelJS.Worksheet> {
    const workbook: ExcelJS.Workbook = new ExcelJS.Workbook();

    const content = await workbook.xlsx.readFile(path);
    return content.worksheets[table];
  }

  private static getCell(row: ExcelJS.Row, cellIndex: number) {
    const cell: ExcelJS.Cell = row.getCell(cellIndex);

    return cell.value ? cell.value.toString() : '';
  }

  private static async getContent(
    table: ExcelJS.Worksheet,
    startIndex: number = 2
  ): Promise<Naming[]> {
    // NOTE: Start index in ExcelJS is 1
    const amount = table.rowCount - 1;

    const rows = table.getRows(startIndex, amount) ?? [];
    const formatted = rows.map((row): Naming => {
      return {
        page: this.getCell(row, 1),
        topic: this.getCell(row, 2),
        language: this.getCell(row, 3),
        text: this.getCell(row, 4),
        value: this.getCell(row, 5),
      };
    });

    return formatted.filter((row) => row.page);
  }

  static async read(path: string, page: number = 0): Promise<Naming[]> {
    if (!(await this.canAccess(path))) return [];

    const table: ExcelJS.Worksheet = await this.getTable(path, page);

    return (await this.getContent(table)) ?? [];
  }
}
