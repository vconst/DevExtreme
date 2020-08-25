/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  JSXComponent, Effect, Component,
} from 'devextreme-generator/component_declaration/common';
import {
  DataGridProps,
} from '../../ui/data_grid/props';

import gridCore from '../../../ui/data_grid/ui.data_grid.core';

import '../../../ui/data_grid/ui.data_grid.column_headers';
import '../../../ui/data_grid/ui.data_grid.columns_controller';
import '../../../ui/data_grid/ui.data_grid.data_controller';
import '../../../ui/data_grid/ui.data_grid.sorting';
import '../../../ui/data_grid/ui.data_grid.rows';
import '../../../ui/data_grid/ui.data_grid.context_menu';
import '../../../ui/data_grid/ui.data_grid.error_handling';
import '../../../ui/data_grid/ui.data_grid.grid_view';
import '../../../ui/data_grid/ui.data_grid.header_panel';

import '../../../ui/data_grid/ui.data_grid';

import { Widget } from '../../ui/common/widget';
import { DataGridPagingProps } from './paging-props';
import { DataGridComponent } from './datagrid_component';
import DataGridViews from './data_grid_views';
import { GridInstance } from './common/types.d';

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

export const viewFunction = ({
  gridInstance,
  props,
  // widgetRef,
  restAttributes,
}: DataGrid) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Widget {...restAttributes}>
    <DataGridViews gridInstance={gridInstance} gridProps={props} />
  </Widget>
);

const pagingDefault = DataGridPagingProps;

@Component({ defaultOptionRules: null, jQuery: { register: true }, view: viewFunction })
export default class DataGrid extends JSXComponent(DataGridProps) {
  componentHolder: { componentInstance?: GridInstance } = { componentInstance: undefined };

  // @Ref() widgetRef!: Widget;

  // It's impossible to define constructor, so it's workaround to lazy creation
  // of gridInstance within componentHolder by imutable way
  get gridInstance() {
    if (!this.componentHolder.componentInstance) {
      this.componentHolder.componentInstance = this.init();
    }
    return this.componentHolder.componentInstance;
  }

  // Uncomment the following code if some view or controlles need element
  // @Effect() renderViews() {
  //   const el = $(this.widgetRef.getHtmlElement());
  //   (this.gridInstance as any).setElement(el);
  // }

  // TODO sync props<->option engine. Possible move to DataGridComponent
  @Effect() updatePagingOptions() {
    const instance = this.gridInstance;
    if (instance) {
      if (this.props.paging) {
        const optionPageIndex = instance.option('paging.pageIndex');
        const propsPageIndex = this.props.paging.pageIndex;
        if (propsPageIndex !== optionPageIndex) {
          console.log('Set paging.pageIndex', propsPageIndex);
          instance.option('paging.pageIndex', propsPageIndex);
        }
      }
    }
  }

  // TODO sync props<->option engine. Possible move to DataGridComponent
  @Effect() updateOptions() {
    const instance = this.gridInstance;
    if (instance) {
      if (this.props.columns!.length > 0) {
        const changedColumn = this.props.columns![1] as any;// TODO generator bug as DataGridColumn;
        const currentColumn = instance.option('columns[1]');
        if (changedColumn?.visible !== currentColumn.visible) {
          instance.option('columns[1].visible', changedColumn.visible);
        } else {
          instance.option('columns', this.props.columns);
        }
      }
    }
  }

  // TODO Move to constructor of DataGridComponent
  init() {
    const deepCloneProps = {
      ...this.props,
      columns: this.props.columns?.map((c) => (typeof c === 'string' ? c : { ...c })),
      paging: { ...pagingDefault, ...this.props.paging },
      pager: { ...this.props.pager },
    } as {};
    console.log('deepCloneProps', deepCloneProps);
    const instance: any = new DataGridComponent({
      ...deepCloneProps,
      onOptionChanged: (args) => {
        gridCore.callModuleItemsMethod(instance, 'optionChanged', [args]);
      },
    });
    // eslint-disable-next-line no-underscore-dangle
    instance.getView = (name: string) => instance._views[name];
    // eslint-disable-next-line no-underscore-dangle
    instance.getController = (name: string) => instance._controllers[name];

    gridCore.processModules(instance, gridCore);
    gridCore.callModuleItemsMethod(instance, 'init');
    return instance as GridInstance;
  }
}
