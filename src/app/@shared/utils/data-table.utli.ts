import { DataTable, Table, ValidVO } from '../../@core/data/base-data';

export function getRowColor(valid: boolean): string {
  return valid ? 'var(--devui-success)' : 'var(--devui-danger)';
}

export function onFetchData<T>(table: Table<T>, dataTable: DataTable<T>): void {
  table.data = dataTable.body.data;
  table.loading = false;
  table.pager.total = dataTable.body.totalNum;
}

export function onFetchValidData<T extends ValidVO>(table: Table<T>, dataTable: DataTable<T>): void {
  onFetchData(table, dataTable);
  dataTable.body.data
    .filter(row => !row.valid)
    .map(row => row['$rowClass'] = 'table-row-invalid');
}

