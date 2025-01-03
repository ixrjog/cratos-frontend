import { BaseVO, DataTable, Table, ValidVO } from '../../@core/data/base-data';
import { finalize, Observable } from 'rxjs';

export function getRowColor(valid: boolean): string {
  return valid ? 'var(--devui-success)' : 'var(--devui-danger)';
}

function _onFetchData<T>(table: Table<T>, dataTable: DataTable<T>): void {
  table.data = dataTable.body.data;
  table.pager.total = dataTable.body.totalNum;
}

export function onFetchData<T extends BaseVO>(table: Table<T>, ob: Observable<DataTable<T>>): void {
  table.data = [];
  table.loading = true;
  ob.pipe(
    finalize(() => {
      table.loading = false;
    }),
  ).subscribe(
    res => _onFetchData(table, res),
  );
}

function _onFetchValidData<T extends ValidVO>(table: Table<T>, dataTable: DataTable<T>): void {
  _onFetchData(table, dataTable);
  dataTable.body.data
    .filter(row => !row.valid)
    .map(row => row['$rowClass'] = 'table-row-invalid');
}

export function onFetchValidData<T extends ValidVO>(table: Table<T>, ob: Observable<DataTable<T>>): void {
  table.data = [];
  table.loading = true;
  ob.pipe(
    finalize(() => {
      table.loading = false;
    }),
  ).subscribe(
    res => _onFetchValidData(table, res),
  );
}
