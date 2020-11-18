// import {
//  JSXComponent, ComponentBindings, OneWay, Template, Component, Ref, Fragment,
// } from 'devextreme-generator/component_declaration/common';
import {
  JSXComponent, Component, Effect, Consumer, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { ToolbarItemType } from '../view-extenders/extender_types';

import { ToolbarItems } from '../view-extenders/header_panel_getters';
import { Plugins, PluginsContext } from './context';
import { DataGridGroupPanel } from '../../ui/data_grid/props';
import { Grid } from '../data_grid/data_grid';

import { GroupPanel as GroupPanelWidget } from '../view-extenders/header_panel_group_panel';
import { GroupPanelItemPlaceholder, GroupPanelItem } from '../view-extenders/group_panel_item';
import { GroupPanelItemSorting } from '../view-extenders/group_panel_item_sorting';
import { PlaceholderExtender } from '../view-extenders/placeholder_extender';

const viewFunction = (): JSX.Element => (
  <Fragment>
    <PlaceholderExtender
      type={GroupPanelItemPlaceholder}
      order={1}
      template={GroupPanelItem}
    />
    <PlaceholderExtender
      type={GroupPanelItemPlaceholder}
      order={3}
      template={GroupPanelItemSorting}
    />
  </Fragment>
);

@Component({ defaultOptionRules: null, view: viewFunction })
export default class GroupPanel extends JSXComponent<DataGridGroupPanel>() {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect()
  updateOptions(): void {
    this.plugins.getValue(Grid).option('editing', this.props);
  }

  @Effect()
  extendToolbarItems(): () => void {
    return this.plugins.extend(
      ToolbarItems, 1,
      (base: ToolbarItemType[]) => {
        if (this.props.visible) {
          return base.concat([{
            name: 'groupPanel',
            location: 'before',
            templateType: GroupPanelWidget,
          }]);
        }
        return base;
      },
    );
  }

  // @Effect({ run: 'once' })
  // updateGroupItemExtenders(): void {
  //   this.plugins.extendPlaceholder(GroupPanelItemPlaceholder, 1, GroupPanelItem);
  //   this.plugins.extendPlaceholder(GroupPanelItemPlaceholder, 3, GroupPanelItemSorting);
  // }
}
