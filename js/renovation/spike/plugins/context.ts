/* eslint-disable max-classes-per-file */
import { createContext } from 'devextreme-generator/component_declaration/common';

let nextEntityId = 1;

class PluginEntity<T, S> {
  id: number;

  constructor() {
    this.id = nextEntityId;
    nextEntityId += 1;
  }

  // eslint-disable-next-line class-methods-use-this
  getValue(value: S): T {
    return value as unknown as T;
  }
}

class PluginGetter<T> extends PluginEntity<T, ((base: T) => T)[]> {
  private readonly defaultValue: T;

  constructor(defaultValue: T) {
    super();
    this.defaultValue = defaultValue;
  }

  // eslint-disable-next-line class-methods-use-this
  getValue(value: ((base: T) => T)[]): T {
    return value.reduce((base, func) => func(base), this.defaultValue);
  }

  /* createValue(): (() => T)[] {
    return [(): T => this.defaultValue];
  } */
}

export function createValue<T>(): PluginEntity<T, T> {
  return new PluginEntity<T, T>();
}

export function createGetter<T>(defaultValue: T): PluginGetter<T> {
  return new PluginGetter<T>(defaultValue);
}

export class Plugins {
  private readonly items: Record<number, unknown> = {};

  private readonly subscriptions: Record<number, Function[]> = {};

  set<T, S>(entity: PluginEntity<T, S>, value: T): void {
    this.items[entity.id] = value;
    const subscriptions = this.subscriptions[entity.id];
    if (subscriptions) {
      subscriptions.forEach((handler) => {
        handler(value);
      });
    }
  }

  extend<T>(entity: PluginGetter<T>, func: (base: T) => T): void {
    const value = this.items[entity.id] as ((base: T) => T)[] || [];
    this.items[entity.id] = value;
    value.push(func);
  }

  getValue<T>(entity: PluginGetter<T>): T {
    const value = this.items[entity.id] as ((base: T) => T)[] || [];
    return entity.getValue(value);
  }

  watch<T, S>(entity: PluginEntity<T, S>, callback: (value: T) => void): () => void {
    const value = this.items[entity.id] as S;
    const subscriptions = this.subscriptions[entity.id] || [];

    this.subscriptions[entity.id] = subscriptions;

    if (value !== undefined) {
      const callbackValue = entity.getValue(value);
      callback(callbackValue);
    }

    subscriptions.push(callback);

    return (): void => {
      const index = subscriptions.indexOf(callback);
      if (index >= 0) {
        subscriptions.splice(index, 1);
      }
    };
  }
}

export const PluginsContext = createContext<Plugins>(null as unknown as Plugins);
