/* eslint-disable react/jsx-props-no-spreading */
import {
  JSXComponent, InternalState, Effect, Component,
} from 'devextreme-generator/component_declaration/common';
import { Pager } from '../../ui/pager/pager';
import PagerProps from '../../ui/pager/common/pager_props';
import { DataGridViewProps } from './common/data_grid_view_props';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  dataControllerProps,
  pageIndexChanged,
  pageSizeChanged,
  pagerProps,
}: DataGridPagerView) => (
  <Pager
    {...pagerProps}
    {...dataControllerProps}
    pageIndexChange={pageIndexChanged}
    pageSizeChange={pageSizeChanged}
  />
);

@Component({ defaultOptionRules: null, view: viewFunction })
export class DataGridPagerView
  extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
  // TODO type DataController
  getDataController(): any {
    return this.props.gridInstance.getController('data');
  }

  @InternalState() dataControllerPropsCache: Partial<PagerProps> = { };

  pageIndexChanged(pageIndex: number): void {
    const dataController = this.getDataController();
    if (dataController.pageIndex() !== pageIndex) {
      // setTimeout(() => {
      dataController.pageIndex(pageIndex);
      // });
    }
  }

  pageSizeChanged(pageSize: number): void {
    // setTimeout(() => {
    this.getDataController().pageSize(pageSize);
    // });
  }

  // TODO add return type
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getDataControllerProps() {
    const dataController = this.getDataController();
    return {
      pageIndex: dataController.pageIndex(),
      pageSize: dataController.pageSize(),
      pageCount: dataController.pageCount(),
      totalCount: dataController.totalCount(),
      hasKnownLastPage: dataController.hasKnownLastPage(),
    };
  }

  // TODO add return type
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get dataControllerProps() {
    return this.dataControllerPropsCache || this.getDataControllerProps();
  }

  // TODO return dispose function this.dataController.changed.remove
  @Effect({ run: 'once' })
  initDataController(): void {
    this.getDataController().changed.add(() => {
      this.dataControllerPropsCache = this.getDataControllerProps();
    });
  }

  // TODO 'auto' fake implementation
  get pagerProps(): Partial<PagerProps> {
    const { visible = false, ...restProps } = this.props.gridProps.pager || {};
    return {
      visible: visible === 'auto' ? true : (visible as boolean),
      ...restProps,
    };
  }
}
