// import {
//  JSXComponent, ComponentBindings, OneWay, Template, Component, Ref, Fragment,
// } from 'devextreme-generator/component_declaration/common';
import {
  JSXComponent, Component, Effect, Consumer, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { ToolbarItemType } from '../view-extenders/extender_types';

import { ToolbarItems } from '../view-extenders/header_panel_view';
import { Plugins, PluginsContext } from '../plugins/context';
import { DataGridGroupPanel } from '../../ui/data_grid/props';
import { Grid } from '../data_grid/data_grid';

import { GroupPanel as GroupPanelWidget } from './group_panel/header_panel_group_panel';
import { GroupPanelItemPlaceholder } from './group_panel/group_panel_item';
import { PlaceholderExtender } from '../plugins/placeholder_extender';

const viewFunction = (): JSX.Element => (
  <Fragment>
    <PlaceholderExtender
      type={GroupPanelItemPlaceholder}
      order={3}
      template={(column, children): JSX.Element => (
        <Fragment>
          {children}
          {' '}
          (
          {column.sortOrder || 'asc'}
          )
        </Fragment>
      )}
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

  // eslint-disable-next-line class-methods-use-this
  get groupingToolbarItems(): ToolbarItemType[] {
    return [{
      name: 'groupPanel',
      location: 'before',
      templateType: GroupPanelWidget,
    }];
  }

  @Effect()
  extendToolbarItems(): () => void {
    return this.plugins.extend(
      ToolbarItems, 1,
      (base: ToolbarItemType[]) => {
        if (this.props.visible) {
          return base.concat(this.groupingToolbarItems);
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
