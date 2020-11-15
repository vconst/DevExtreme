/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  JSXComponent, Component, InternalState, Effect, Fragment, Consumer,
} from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
import { Toolbox } from './toolbox';
import { View } from './view';
import { RenovatedViewInstance } from './view_instance';
import { ToolbarItemType } from './extender_types';
import { ToolbarItems } from './header_panel_getters';

import { HeaderPanelEditing } from './header_panel_editing';

import { HeaderPanelExport } from './header_panel_export';
import { HeaderPanelGrouping } from './header_panel_grouping';

import './group_panel_item_sorting';
import './group_panel_item_filtering';
import { Plugins, PluginsContext } from '../plugins/context';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  toolbarItems, isVisible,
  props: { gridInstance, gridProps },
}: HeaderPanelView) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Fragment>
    <View isVisible={isVisible}>
      <HeaderPanelGrouping gridInstance={gridInstance} gridProps={gridProps} />
      <HeaderPanelEditing gridInstance={gridInstance} gridProps={gridProps} />
      <HeaderPanelExport gridInstance={gridInstance} gridProps={gridProps} />

      <Toolbox items={(toolbarItems
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

  @InternalState() toolbarItems: ToolbarItemType[] = [];

  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect()
  updateToolbarItems() {
    return this.plugins.watch(ToolbarItems, (items) => {
      this.toolbarItems = items;
    });
  }

  get isVisible() {
    return this.toolbarItems.length > 0;
  }

  setToolbarItemDisabled(itemName: string, disabled: boolean) {
    let needUpdate = false;
    const items = this.toolbarItems?.map((item) => {
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
      this.toolbarItems = items;
    }
  }

  @Effect() extendViewInstance() {
    this.viewInstance.setToolbarItemDisabled = this.setToolbarItemDisabled;
  }
}
