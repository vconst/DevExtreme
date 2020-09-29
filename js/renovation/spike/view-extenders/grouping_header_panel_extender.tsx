import {
  JSXComponent, Component, InternalState, Effect,
} from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
// import { DataGridProps } from '../../ui/data_grid/props';
import { ToolboxItemPositionType } from './toolbox_item';
// import { HeaderPanelExtender, ViewExtender } from './extender_types';

import { isVisibleGetter, getToolbarItemsGetter } from './header_panel_getters';

import { GroupPanelItemPlaceholder } from './group_panel_item_placeholder';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  items,
}: GroupingHeaderPanel) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div>
    { (items
      .map((column) => (
        <div className={column.cssClass}>
          <GroupPanelItemPlaceholder column={column} />
        </div>
      ))) }
  </div>
);

@Component({ defaultOptionRules: null, view: viewFunction })
export class GroupingHeaderPanel extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
  @InternalState() groupingColumns;

  get items(): { caption: string; cssClass: string}[] {
    const groupColumns = this.groupingColumns || this.props.gridInstance.getController('columns').getGroupColumns();
    return groupColumns;
  }

  @Effect({ run: 'once' }) init() {
    const columnsController = this.props.gridInstance.getController('columns');
    columnsController.columnsChanged.add(() => {
      this.groupingColumns = this.props.gridInstance.getController('columns').getGroupColumns();
    });
  }
}

/*
export const groupingHeaderPanelExtender: HeaderPanelExtender & ViewExtender = {
  isVisible: (gridProps: DataGridProps) => {
    const groupPanelOptions = gridProps.groupPanel;
    let isVisible;
    if (groupPanelOptions) {
      isVisible = groupPanelOptions.visible;

      if (isVisible === 'auto') {
        // TODO Vitik
        // isVisible = devices.current().deviceType === 'desktop' ? true : false;
        isVisible = true;
      }
    }
    return isVisible;
  },
  getToolbarItems: () => [{ name: 'groupPanel', location: 'before' as ToolboxItemPositionType,
  templateType: GroupingHeaderPanel }],
};
*/

export const getToolbarItemsGrouping = (
  gridView: DataGridViewProps,
  base: Function,
): [] => base().concat([{ name: 'groupPanel', location: 'before' as ToolboxItemPositionType, templateType: GroupingHeaderPanel }]);

getToolbarItemsGetter.register(getToolbarItemsGrouping);

export const isVisibleGrouping = (
  gridView: DataGridViewProps,
  base: Function,
): boolean => {
  const groupPanelOptions = gridView.gridProps.groupPanel;
  let isVisible;
  if (groupPanelOptions) {
    isVisible = groupPanelOptions.visible;

    if (isVisible === 'auto') {
      // TODO Vitik
      // isVisible = devices.current().deviceType === 'desktop' ? true : false;
      isVisible = true;
    }
  }
  return isVisible || base();
};

isVisibleGetter.register(isVisibleGrouping);
