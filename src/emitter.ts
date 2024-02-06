export enum EventType {
  onCreate = 'create',
  onUpdate = 'update',
  onDestroy = 'destroy',
}

interface IEventEmitter {
  events: Record<string, (() => void)[]>;
  dispatch(eventType: EventType, uniqueSuffix: string | number): void;
  subscribe(eventType: EventType, uniqueSuffix: string | number, callback: () => void): void
  unsubscribe(eventType: EventType, uniqueSuffix: string | number): void
  getEventKey(eventType: EventType, uniqueSuffix: string | number): string
}

export const eventEmitter: IEventEmitter = {
  events: {},

  getEventKey(eventType: EventType, uniqueSuffix: string | number) {
    return `${eventType} ${uniqueSuffix}`;
  },

  dispatch(event, uniqueSuffix) {
    const eventName = this.getEventKey(event, uniqueSuffix);

    if (!this.events[eventName]) {
      return;
    }

    this.events[eventName].forEach((callback: () => void) => callback());
  },


  subscribe(event, uniqueSuffix, callback) {
    const eventName = this.getEventKey(event, uniqueSuffix);

    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    if (!this.events[eventName]?.includes(this.events[eventName][0])) {
      this.events[eventName]?.push(callback);
    }
  },

  unsubscribe(event, uniqueSuffix) {
    const eventName = this.getEventKey(event, uniqueSuffix);

    if (!this.events[eventName]) {
      return;
    }

    delete this.events[eventName];
  },
};
