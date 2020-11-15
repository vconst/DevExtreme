import {
  JSXComponent, Fragment, Component, Consumer, Effect,
} from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
// import { DataGridProps } from '../../ui/data_grid/props';
// import { HeaderPanelExtender, ViewExtender } from './extender_types';

import { ToolbarItems } from './header_panel_getters';

import { GroupPanel } from './header_panel_group_panel';
import { PluginsContext, Plugins } from '../plugins/context';
import { ToolbarItemType } from './extender_types';
import { DataGridGroupPanel } from '../../ui/data_grid/props';

export const isVisibleGrouping = (
  groupPanelOptions: DataGridGroupPanel | undefined,
): boolean => {
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
};

const viewFunction = (): JSX.Element => <Fragment />;

@Component({ defaultOptionRules: null, view: viewFunction })
export class HeaderPanelGrouping extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect({ run: 'once' })
  extendToolbarItems(): void {
    return this.plugins.extend(
      ToolbarItems,
      (base: ToolbarItemType[]) => {
        if (isVisibleGrouping(this.props.gridProps.groupPanel)) {
          return base.concat([{ name: 'groupPanel', location: 'before', templateType: GroupPanel }]);
        }
        return base;
      },
    );
  }
}
