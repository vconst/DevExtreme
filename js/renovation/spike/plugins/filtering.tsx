import {
  JSXComponent, Component, Effect, Consumer, Fragment, ComponentBindings,
} from 'devextreme-generator/component_declaration/common';
import { PluginsContext, Plugins } from './context';
import { GroupPanelItemPlaceholder } from '../view-extenders/group_panel_item';
import { GroupPanelItemFilter } from '../view-extenders/group_panel_item_filtering';

const viewFunction = (): JSX.Element => <Fragment />;

@ComponentBindings()
export class FilteringProps {
}

@Component({ defaultOptionRules: null, view: viewFunction })
export default class Filtering extends JSXComponent<FilteringProps>() {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect({ run: 'once' })
  updateGroupPanel(): void {
    this.plugins.extendPlaceholder(GroupPanelItemPlaceholder, GroupPanelItemFilter);
  }
}
