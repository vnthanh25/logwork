import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], sheetName: string, excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const sheets: any = {};
    sheets[sheetName] = worksheet;
    const workbook: XLSX.WorkBook = { Sheets: sheets, SheetNames: [sheetName] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportDailyAsExcelFile(sheetRows: any[], sheetNames: string[], excelFileName: string): void {
    const sheets: any = {};
    for (let index = 0; index < sheetRows.length; index++) {
      const rows = sheetRows[index];
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
      sheets[sheetNames[index]] = worksheet;
    }
    const workbook: XLSX.WorkBook = { Sheets: sheets, SheetNames: sheetNames };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

}
