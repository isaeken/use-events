import { AxiosLaravelAdapter } from './adapters/AxiosLaravelAdapter';
import type { Adapter, QueryPart, TOperator } from './types';

export class Query<T> {
  public adapter: Adapter<T> = new AxiosLaravelAdapter<T>();
  public query: QueryPart<T>[] = [];

  public with = (relations: string[]): this => {
    this.query = [
      ...this.query,
      {
        type: 'with',
        relations,
      },
    ];

    return this;
  };

  public withTrashed = (): this => {
    this.query = [
      ...this.query,
      {
        type: 'withTrashed',
      },
    ];

    return this;
  };

  public onlyTrashed = (): this => {
    this.query = [
      ...this.query,
      {
        type: 'onlyTrashed',
      },
    ];

    return this;
  };

  public where(
    key: keyof T,
    operator: Exclude<TOperator, 'in' | 'not in'>,
    value: T[keyof T]
  ): this;

  public where(key: keyof T, operator: 'in' | 'not in', value: T[keyof T][]): this;

  public where(key: keyof T, operator: TOperator, value: T[keyof T] | T[keyof T][]): this {
    this.query = [
      ...this.query,
      {
        type: 'where',
        key,
        operator,
        value,
      },
    ];

    return this;
  }

  public orWhere = (key: keyof T, operator: TOperator, value: T[keyof T]): this => {
    this.query = [
      ...this.query,
      {
        type: 'orWhere',
        key,
        operator,
        value,
      },
    ];

    return this;
  };

  public orderBy = (key: keyof T, direction: 'asc' | 'desc' = 'asc'): this => {
    this.query = [
      ...this.query,
      {
        type: 'orderBy',
        key,
        direction,
      },
    ];

    return this;
  };

  public limit = (limit: number): this => {
    this.query = [
      ...this.query,
      {
        type: 'limit',
        limit,
      },
    ];

    return this;
  };

  public getQuery = (): any[] => {
    return this.query;
  };

  public count = async (): Promise<number> => {
    return (await this.adapter.runQuery(this.query)) as number;
  };

  public get = async (): Promise<T[]> => {
    return [] as T[];
  };
}
