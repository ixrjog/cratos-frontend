export interface HttpResult<T> {
  body: T;
  success: boolean;
  msg: string;
  code: number;
}

export interface MessageResponse<T> {
  body: T;
  topic: string;
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
  createTime: Date;
  updateTime: Date;
}

export interface ValidVO {
  valid: boolean;
}

export interface ResourceCountVO {
  resourceCount: Map<String, number>;
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

export interface OptionsVO {
  options: {
    label: string;
    value: any;
    disabled: boolean;
    comment: any;
  }[]
}

export const TABLE_DATA: Table<any> = {
  loading: false,
  data: [],
  pager: {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  },
};

export interface CommitParam {
  businessId?: number
  businessType?: string
  username?: string
  message: string
  content?: string
}


