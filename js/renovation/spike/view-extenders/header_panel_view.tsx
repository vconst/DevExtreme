/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  JSXComponent, Component, InternalState, Effect, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
import { Toolbox } from './toolbox';
// import { groupingHeaderPanelExtender } from './grouping_header_panel_extender';
import { View } from './view';
import { RenovatedViewInstance } from './view_instance';
import { ToolbarItemType } from './extender_types';
import { getToolbarItemsGetter, isVisibleGetter } from './header_panel_getters';
// import { editHeaderPanelExtender } from './editing_header_panel_extender';
// import { exportHeaderPanelExtender } from './export_header_panel_extender';
// import { DataGridView } from '../data_grid/common/types';

import './grouping_header_panel_extender';
import './export_header_panel_extender';
import './editing_header_panel_extender';

import './sorting_extender';
import './filtering_extender';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  items, isVisible,
  props: { gridInstance, gridProps },
}: HeaderPanelView) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Fragment>
    <View isVisible={isVisible}>
      <Toolbox items={(items
        .map(({
          location, name, props, templateType: ItemTemplate,
        }) => ({
          location,
          name,
          template: props
          // eslint-disable-next-line react/jsx-props-no-spreading
            ? () => (<ItemTemplate {...props} />)
            : () => (<ItemTemplate gridInstance={gridInstance} gridProps={gridProps} />),
        }))
      )}
      />
    </View>
  </Fragment>
);

@Component({ defaultOptionRules: null, view: viewFunction })
export class HeaderPanelView extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
  get viewInstance(): RenovatedViewInstance & { setToolbarItemDisabled: (i, b) => void} {
    const viewInstance = this.props.gridInstance.getView('headerPanel');
    return viewInstance;
  }

  @InternalState() cachedItems: ToolbarItemType[] | null = null;

  getItems() {
    return getToolbarItemsGetter.execute(this.props);
    /* return extenders
      .reduce<ToolbarItemType[]>((items, extender) => ([
      ...items,
      ...extender.getToolbarItems(this.props.gridInstance)]),
    []); */
  }

  get items(): ToolbarItemType[] {
    if (!this.cachedItems) {
      const items = this.getItems() as ToolbarItemType[];
      this.cachedItems = items;
      return items;
    }
    return this.cachedItems;
  }

  get isVisible() {
    return isVisibleGetter.execute(this.props) as boolean;
    // return extenders.some((extender) => !extender.isVisible(this.props.gridProps)) === null;
  }

  setToolbarItemDisabled(itemName: string, disabled: boolean) {
    let needUpdate = false;
    const items = this.cachedItems?.map((item) => {
      if (item.name === itemName && item.props?.disabled !== disabled) {
        needUpdate = true;
        return {
          ...item,
          props: { ...item.props, disabled },
        };
      }
      return item;
    }) as ToolbarItemType[] || [];
    if (needUpdate) {
      console.log('updated items', itemName, items);
      this.cachedItems = items;
    }
  }

  @Effect() extendViewInstance() {
    this.viewInstance.setToolbarItemDisabled = this.setToolbarItemDisabled;
  }
}
