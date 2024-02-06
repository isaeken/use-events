export type TEventType = 'create' | 'update' | 'destroy';

export interface IModel extends IHasId, IHasTimestamps, IHasSoftDeletes {
  [key: string]: any;
}

export interface IHasId {
  id?: any;
}

export interface IHasTimestamps {
  created_at?: Date;
  updated_at?: Date | null;
}

export interface IHasSoftDeletes {
  deleted_at?: Date | null;
}

export interface IPayload<T extends IModel> {
  type: TEventType;
  id?: string | null;
  model: T | null;
  previous?: Partial<T> | null;
  changes?: Partial<T> | null;
  date: Date;
}

export interface Adapter<T> {
  runQuery(query: QueryPart<T>[]): Promise<unknown>;
}

export interface QueryPart<T> {
  type:
    | 'where'
    | 'whereIn'
    | 'with'
    | 'withTrashed'
    | 'onlyTrashed'
    | 'orderBy'
    | 'orWhere'
    | 'limit';
  key?: keyof T;
  operator?: TOperator;
  value?: T[keyof T] | T[keyof T][];
  relations?: string[];
  direction?: 'asc' | 'desc';
  limit?: number;
}

export type TOperator =
  | '=='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'in'
  | 'not in'
  | 'like'
  | 'not like';

export type TWhere = {
  key: string;
  operator: TOperator;
};

export type TWhereIn = {
  key: string;
  operator: 'in' | 'not in';
  value: any[];
};
