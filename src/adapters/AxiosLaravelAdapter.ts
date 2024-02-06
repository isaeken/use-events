import { Adapter, IModel, QueryPart } from '../types';

export class AxiosLaravelAdapter<T> implements Adapter<T> {
  public async runQuery<T extends IModel>(query: QueryPart<T>[]): Promise<unknown> {
    console.log(query);

    return Promise.resolve({});
  }
}
