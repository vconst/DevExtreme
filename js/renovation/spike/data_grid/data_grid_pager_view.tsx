/* eslint-disable react/jsx-props-no-spreading */
import {
  ComponentBindings, JSXComponent, OneWay, InternalState, Effect, Component,
} from 'devextreme-generator/component_declaration/common';
import Pager from '../../pager/pager';
import PagerProps from '../../pager/pager-props';

export const viewFunction = ({
  dataControllerProps,
  pageIndexChanged,
  pageSizeChanged,
  props,
}: DataGridPager) => (
  <Pager
    {...props}
    {...dataControllerProps}
    pageIndexChange={pageIndexChanged}
    pageSizeChange={pageSizeChanged}
  />
);

@ComponentBindings()
export class DataGridPagerProps {
  @OneWay() dataController;

  @OneWay() visible?: boolean = true;

  @OneWay() showPageSizes? = true;

  @OneWay() pagesNavigatorVisible?: boolean | 'auto' = 'auto';

  @OneWay() showInfo?: boolean = false;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export default class DataGridPager extends JSXComponent(DataGridPagerProps) {
  @InternalState() dataControllerProps: PagerProps = { };

  // TODO разобраться почему не работает (this.props.dataController undefined)
  // pageIndexChanged(pageIndex: number) {
  //   const { dataController } = this.props.dataController;
  //   if (dataController.pageIndex() !== pageIndex) {
  //     // setTimeout(() => {
  //     dataController.pageIndex(pageIndex);
  //     // });
  //   }
  // }
  pageIndexChanged(pageIndex: number) {
    if (this.props.dataController.pageIndex() !== pageIndex) {
      // setTimeout(() => {
      this.props.dataController.pageIndex(pageIndex);
      // });
    }
  }

  pageSizeChanged(pageSize: number) {
    // setTimeout(() => {
    this.props.dataController.pageSize(pageSize);
    // });
  }

  updateDataControllerProps(dataController) {
    // workaround for generator bug
    const r = {
      pageIndex: dataController.pageIndex(),
      pageSize: dataController.pageSize(),
      pageCount: dataController.pageCount(),
      totalCount: dataController.totalCount(),
      // hasKnownLastPage: dataController.hasKnownLastPage(),
    };
    this.dataControllerProps = r;
  }

  @Effect() initDataController() {
    const { dataController } = this.props;
    this.updateDataControllerProps(dataController);
    dataController.changed.add(() => {
      this.updateDataControllerProps(dataController);
      // if (e && e.repaintChangesOnly) {
      //   } else {
      //     that.render();
      //   }
      // } else if (!e || e.changeType !== 'update' && e.changeType !== 'updateSelection') {
      //   that.render();
      // }
    });
    // return {};
  }
}
