/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ComponentBindings, JSXComponent, OneWay, InternalState, Effect, Component, Ref, Nested,
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

import '../../ui/data_grid/ui.data_grid';

import $ from '../../core/renderer';
import Widget from '../../ui/widget/ui.widget';
import DataGridPager, { DataGridPagerProps } from './data_grid_pager_view';
import { DataGridPagingProps } from './paging-props';

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
  dataController,
  pageIndexChange,
  props: { pager },
  widgetRef,
  restAttributes,
}: DataGrid) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...restAttributes}>
    Hello data-grid
    <div className="dx-widget" ref={widgetRef as any} />
    pager
    {dataController && (
    <DataGridPager
      {...pager}
      dataController={dataController}
      pageIndexChange={pageIndexChange}
    />
    )}
  </div>
);

type Column = {
  dataField: string;
  visible?: boolean;
};

type Pager = DataGridPagerProps;
type Paging = Partial<typeof DataGridPagingProps>;

@ComponentBindings()
export class DataGridProps {
  @OneWay() dataSource?: string | Array<any> | DataSource | DataSourceOptions;

  @Nested() pager?: Pager;

  @Nested() paging?: Paging;

  // @Nested() paging? = new DataGridPagingProps();

  @Nested() columns?: Column[] = [];

  @OneWay() showColumnHeaders? = true;
}

  type GridInstance = (Widget & {
    getView(name: string): any;
    getController(name: string): any;
  });

const pagingDefault: Paging = DataGridPagingProps;

@Component({ defaultOptionRules: null, jQuery: { register: true }, view: viewFunction })
export default class DataGrid extends JSXComponent(DataGridProps) {
  @InternalState() gridInstance!: GridInstance;

  @Ref() widgetRef!: HTMLDivElement;

  @Effect() setupWidget() {
    if (!this.gridInstance) {
      const instance = this.init();
      this.gridInstance = instance;
      instance.getView('gridView').render($(this.widgetRef));
    }
  }

  pageIndexChange(pageIndex: number) {
    this.props.paging?.pageIndexChange?.(pageIndex);
  }

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

  @Effect() updateOptions() {
    const instance = this.gridInstance;
    if (instance) {
      if (this.props.columns!.length > 0) {
        const changedColumn = (this.props.columns as Column[])[1] as Column;
        const currentColumn = instance.option('columns[1]');
        if (changedColumn?.visible !== currentColumn.visible) {
          instance.option('columns[1].visible', changedColumn.visible);
        } else {
          instance.option('columns', this.props.columns);
        }
      }
    }
  }

  get dataController() {
    return this.gridInstance?.getController?.('data');
  }

  init() {
    const deepCloneProps = {
      ...this.props,
      columns: this.props.columns?.map((c) => ({ ...c })),
      paging: { ...pagingDefault, ...this.props.paging },
      pager: { /* ...(new DataGridPagerProps()), */ ...this.props.pager },
    };
    console.log('deepCloneProps', deepCloneProps);
    const instance: any = new Widget(this.widgetRef, {
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
