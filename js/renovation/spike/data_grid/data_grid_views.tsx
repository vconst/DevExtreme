import {
  Fragment, JSXComponent, Component,
} from 'devextreme-generator/component_declaration/common';
import { DataGridProps } from '../../ui/data_grid/props';
import { DataGridView } from './common/types';
import { DataGridViewProps } from './common/data_grid_view_props';
import { DataGridViewWrapper } from './data_grid_view_wrapper';

import { DataGridPagerView } from './data_grid_pager_view';
import { DataGridHeaderPanelView } from './data_grid_header_panel_view';
import { ViewRefWrapper } from '../view-extenders/view_ref_wrapper';

const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';

const VIEW_NAMES = ['columnsSeparatorView', 'blockSeparatorView', 'trackerView', 'headerPanel', 'columnHeadersView', 'rowsView', 'footerView', 'columnChooserView', 'filterPanelView', 'pagerView', 'draggingHeaderView', 'contextMenuView', 'errorView', 'headerFilterView', 'filterBuilderView'];
export const VIEWCOMPONENTS = {
  pagerView: { type: DataGridPagerView },
  headerPanel: { type: DataGridHeaderPanelView },
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  gridProps,
  views,
  props: { gridInstance },
}: DataGridViews) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Fragment>
    {gridProps.children}
    <div className={`dx-datagrid ${GRIDBASE_CONTAINER_CLASS}`}>
      {(views.map(({ name, view, ViewComponent }) => (ViewComponent ? (
        <Fragment>
          <ViewRefWrapper
            key={`${name}new`}
            gridProps={gridProps}
            gridInstance={gridInstance}
            viewComponentTemplate={(props) => (
              <ViewComponent
                ref={props.componentRef}
                gridProps={gridProps}
                gridInstance={gridInstance}
              />
            )}
            viewName={name}
          />
          {/* <DataGridViewWrapper key={`${name}old`} view={view} /> */}
        </Fragment>
      ) : <DataGridViewWrapper key={name} view={view} />))
    )}
    </div>
  </Fragment>
);

@Component({ defaultOptionRules: null, view: viewFunction })
export class DataGridViews extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
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
          ViewComponent: VIEWCOMPONENTS[viewName]?.type,
        }));
  }
}
