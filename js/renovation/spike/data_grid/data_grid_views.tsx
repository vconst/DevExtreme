import {
  Fragment, JSXComponent, Component,
} from 'devextreme-generator/component_declaration/common';
import { DataGridProps } from '../../ui/data_grid/props';
import { DataGridPagerView } from './data_grid_pager_view';
import { DataGridView, DataGridViewProps } from './common/types.d';
import { DataGridViewWrapper } from './data_grid_view_wrapper';

const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';

const VIEW_NAMES = ['columnsSeparatorView', 'blockSeparatorView', 'trackerView', 'headerPanel', 'columnHeadersView', 'rowsView', 'footerView', 'columnChooserView', 'filterPanelView', 'pagerView', 'draggingHeaderView', 'contextMenuView', 'errorView', 'headerFilterView', 'filterBuilderView'];
const VIEWCOMPONENTS = { pagerView: DataGridPagerView };

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  gridProps,
  views,
  props: { gridInstance },
}: DataGridViews) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Fragment>
    <div className={GRIDBASE_CONTAINER_CLASS}>
      {(views.map(({ name, view, ViewComponent }) => (ViewComponent ? (
        <ViewComponent
          key={name}
          gridProps={gridProps}
          gridInstance={gridInstance}
        />
      ) : <DataGridViewWrapper key={name} view={view} />))
    )}
    </div>
  </Fragment>
);

@Component({ defaultOptionRules: null, jQuery: { register: true }, view: viewFunction })
export default class DataGridViews extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
  get gridProps(): DataGridProps {
    return this.props.gridProps;
  }

  get views(): {name: string; view: DataGridView; ViewComponent: any}[] {
    return VIEW_NAMES
      .filter((viewName) => this.props.gridInstance?.getView(viewName))
      .map((viewName) => (
        {
          name: viewName,
          view: (this.props.gridInstance?.getView(viewName) as DataGridView),
          ViewComponent: VIEWCOMPONENTS[viewName],
        }));
  }
}
