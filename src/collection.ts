import type { IPayload, IModel } from './types';
import { uniqueArrayBy } from './utils';
import { EventEmitter } from 'events';
import TypedEventEmitter from 'typed-emitter';
import { Query } from './query';

type EventEmitterProps = {
  create: (model: IModel) => void;
  update: (id: any, changes: Partial<IModel>, previous: Partial<IModel> | null) => void;
  destroy: (id: any, model: IModel) => void;
};

interface CollectionProps<T extends IModel> {
  model?: T;
}

export class Collection<T extends IModel> extends Query<T> {
  public props: CollectionProps<T> = {};
  public rows: T[] = [];
  public events = new EventEmitter() as TypedEventEmitter<EventEmitterProps>;

  public constructor(props: CollectionProps<T> = {}) {
    super();

    this.props = props;
  }

  public dispatch = (action: IPayload<T>): Collection<T> => {
    const { type, model, id } = action;

    if (type === 'create' && model !== null) {
      this.events.emit('create', model);

      this.rows = uniqueArrayBy([...this.rows, model], 'id');
    }

    if (type === 'update' && model?.id != null) {
      this.rows = this.rows.map((row) => {
        if (row.id === id) {
          this.events.emit(
            'update',
            model.id,
            action.changes as Partial<T>,
            action.previous as Partial<T> | null
          );

          return model as any;
        }

        return row;
      });
    }

    if (type === 'destroy' && model !== null) {
      this.events.emit('destroy', model.id, model);

      this.rows = this.rows.filter((row) => row.id !== id);
    }

    return this;
  };

  public get = async (): Promise<T[]> => {
    const items = await super.get();
    this.merge(items);

    return this.rows;
  };

  public merge = (rows: T[]): Collection<T> => {
    this.rows = uniqueArrayBy([...this.rows, ...rows], 'id');

    return this;
  };

  public create = (model: T) => {
    this.dispatch({
      type: 'create',
      id: model.id,
      model: model,
      date: new Date(),
      previous: null,
      changes: null,
    });
  };

  public update = (id: any, changes: Partial<T>, previous: Partial<T> | null = null) => {
    previous = previous ?? (this.rows.find((row) => row.id === id) || {});

    this.dispatch({
      type: 'update',
      id: id,
      model: { ...previous, ...changes } as any,
      date: new Date(),
      previous: previous,
      changes: changes,
    });
  };

  public destroy = (model: T) => {
    this.dispatch({
      type: 'destroy',
      id: model.id,
      model: model,
      date: new Date(),
      previous: null,
      changes: null,
    });
  };

  render() {
    return null;
  }
}
