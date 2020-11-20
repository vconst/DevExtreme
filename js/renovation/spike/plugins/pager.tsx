import {
  JSXComponent, Component, Effect, Consumer,
} from 'devextreme-generator/component_declaration/common';
import { DataGridPager } from '../../ui/data_grid/props';
import PagerProps from '../../ui/pager/common/pager_props';
import { PluginsContext, Plugins } from './context';
import { Grid } from '../data_grid/data_grid';
import { Pager as PagerWidget } from '../../ui/pager/pager';
import { PlaceholderExtender } from '../view-extenders/placeholder_extender';
import { PagerPlaceholder } from '../data_grid/data_grid_pager_view';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  pageIndexChanged,
  pageSizeChanged,
  pagerProps,
  pageIndex,
  pageSize,
  pageCount,
  totalCount,
  hasKnownLastPage,
}: Pager) => (
  <PlaceholderExtender
    type={PagerPlaceholder}
    order={1}
    template={() => (
      <PagerWidget
      // eslint-disable-next-line react/jsx-props-no-spreading
        {...pagerProps}
        gridCompatibility={false}
        pageIndex={pageIndex}
        pageIndexChange={pageIndexChanged}
        pageSize={pageSize}
        pageSizeChange={pageSizeChanged}
        pageCount={pageCount}
        totalCount={totalCount}
        hasKnownLastPage={hasKnownLastPage}
      />
    )}
  />

);

@Component({ defaultOptionRules: null, view: viewFunction })
export default class Pager extends JSXComponent<DataGridPager>() {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  pageIndex?: number;

  pageSize?: number;

  pageCount?: number;

  totalCount?: number;

  hasKnownLastPage?: boolean;

  // TODO type DataController
  getDataController(): any {
    return this.plugins.getValue(Grid).getController('data');
  }

  pageIndexChanged(pageIndex: number): void {
    const dataController = this.getDataController();
    if (dataController && dataController.pageIndex() !== pageIndex) {
      // setTimeout(() => {
      dataController.pageIndex(pageIndex);
      // });
    }
  }

  pageSizeChanged(pageSize: number): void {
    // setTimeout(() => {
    this.getDataController()?.pageSize(pageSize);
    // });
  }

  // TODO return dispose function this.dataController.changed.remove
  @Effect({ run: 'once' })
  initDataController(): () => void {
    const dataController = this.getDataController();
    const changedHandler = (): void => {
      this.pageIndex = dataController.pageIndex();
      this.pageSize = dataController.pageSize();
      this.pageCount = dataController.pageCount();
      this.totalCount = dataController.totalCount();
      this.hasKnownLastPage = dataController.hasKnownLastPage();
    };

    dataController?.changed.add(changedHandler);
    return (): void => {
      dataController?.changed.remove(changedHandler);
    };
  }

  // TODO 'auto' fake implementation
  get pagerProps(): Partial<PagerProps> {
    const { visible = false, ...restProps } = this.props;
    return {
      visible: visible === 'auto' ? true : (visible as boolean),
      ...restProps,
    };
  }
}
