export interface HttpResult<T> {
  body: T;
  success: boolean;
  msg: string;
  code: number;
}

export interface DataTable<T> {
  body: {
    data: Array<T>,
    nowPage: number,
    totalNum: number,
  };
  success: boolean;
  msg: string;
  code: number;
}

export interface PageQuery {
  page: number;
  length: number;
}

export interface BaseVO {
  createTim: Date;
  updateTime: Date;
}

export interface Table<T> {
  loading: boolean,
  data: Array<T>,
  pager: {
    pageIndex: number,
    pageSize: number,
    total: number,
  }
}
