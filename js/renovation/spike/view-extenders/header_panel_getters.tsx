// import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';

function executeGetter<P, R>(
  options: P,
  getters: Function[],
  index = 0,
): R {
  return getters[index](
    options,
    index >= getters.length
      ? null
      : (): R => executeGetter(options, getters, index + 1),
  );
}
/*
class Getter<P, R> {
  private readonly getters: ((options: P, base: () => R) => R)[];

  constructor(defaultValue: R) {
    this.getters = [(): R => defaultValue];
  }

  execute(options: P): R {
    return executeGetter(options, this.getters);
  }

  register(func: (options: P, base: () => R) => R): void {
    this.getters.unshift(func);
  }
}
*/
class Getter {
  private readonly getters: Function[];

  constructor(defaultValue) {
    this.getters = [() => defaultValue];
  }

  execute(options) {
    return executeGetter(options, this.getters);
  }

  register(func): void {
    this.getters.unshift(func);
  }
}

export const isVisibleGetter = new Getter/* <DataGridViewProps, boolean> */(false);

export const getToolbarItemsGetter = new Getter/* <DataGridViewProps, []> */([]);
