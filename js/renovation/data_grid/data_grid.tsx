/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ComponentBindings, JSXComponent, OneWay, InternalState, Effect, Component, Ref,
} from 'devextreme-generator/component_declaration/common';
import DataSource, { DataSourceOptions } from '../../data/data_source';

import gridCore from '../../ui/data_grid/ui.data_grid.core';

import '../../ui/data_grid/ui.data_grid.column_headers';
import '../../ui/data_grid/ui.data_grid.columns_controller';
import '../../ui/data_grid/ui.data_grid.data_controller';
import '../../ui/data_grid/ui.data_grid.sorting';
import '../../ui/data_grid/ui.data_grid.rows';
import '../../ui/data_grid/ui.data_grid.context_menu';
import '../../ui/data_grid/ui.data_grid.error_handling';
import '../../ui/data_grid/ui.data_grid.grid_view';
import '../../ui/data_grid/ui.data_grid.header_panel';

import $ from '../../core/renderer';
import Widget from '../../ui/widget/ui.widget';

export const viewFunction = ({
  widgetRef,
}: DataGrid) => (
  <div>
    Hello data-grid
    <div className="dx-widget" ref={widgetRef as any} />
  </div>
);


type Column = {
  dataField: string;
  visible: boolean;
} | string;

@ComponentBindings()
export class DataGridProps {
  @OneWay() dataSource?: string | Array<any> | DataSource | DataSourceOptions;

  @OneWay() columns?: Column[];

  @OneWay() showColumnHeaders?: boolean = true;
}

gridCore.registerModulesOrder([
  'stateStoring',
  'columns',
  'selection',
  'editorFactory',
  'columnChooser',
  'grouping',
  'editing',
  'masterDetail',
  'validating',
  'adaptivity',
  'data',
  'virtualScrolling',
  'columnHeaders',
  'filterRow',
  'headerPanel',
  'headerFilter',
  'sorting',
  'search',
  'rows',
  'pager',
  'columnsResizingReordering',
  'contextMenu',
  'keyboardNavigation',
  'errorHandling',
  'summary',
  'columnFixing',
  'export',
  'gridView']);

@Component({ defaultOptionRules: null, view: viewFunction })
export default class DataGrid extends JSXComponent(DataGridProps) {
  @InternalState() gridState: any = null;

  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect()
  setupWidget() {
    let instance = this.gridState;
    if (this.gridState === null) {
      instance = this.init();
      this.gridState = instance;
    }
    instance.getView('gridView').render($(this.widgetRef));
  }

  init() {
    const instance: any = new Widget(this.widgetRef, {
      ...this.props as any,
    });
    // eslint-disable-next-line no-underscore-dangle
    instance.getView = (name: string) => instance._views[name];
    // eslint-disable-next-line no-underscore-dangle
    instance.getController = (name: string) => instance._controllers[name];

    gridCore.processModules(instance, gridCore);
    gridCore.callModuleItemsMethod(instance, 'init');

    return instance;
  }
}
