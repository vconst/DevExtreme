// import {
//  JSXComponent, ComponentBindings, OneWay, Template, Component, Ref, Fragment,
// } from 'devextreme-generator/component_declaration/common';
import {
  JSXComponent, Component, Effect, Consumer, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { ToolbarItemType } from '../view-extenders/extender_types';

import { Button } from '../../ui/button';

import { ToolbarItems } from '../view-extenders/header_panel_getters';
import { Plugins, PluginsContext } from './context';
import { DataGridEditing } from '../../ui/data_grid/props';
import { Grid } from '../data_grid/data_grid';

const EDIT_MODE_BATCH = 'batch';

const isVisibleEditing = (editingOptions: DataGridEditing | undefined): boolean => !!(editingOptions
  && (editingOptions.allowAdding
    || ((editingOptions.allowUpdating || editingOptions.allowDeleting)
        && editingOptions.mode === EDIT_MODE_BATCH))
);

const viewFunction = (): JSX.Element => <Fragment />;

@Component({ defaultOptionRules: null, view: viewFunction })
export default class Editing extends JSXComponent<DataGridEditing>() {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect()
  updateOptions(): void {
    this.plugins.getValue(Grid).option('editing', this.props);
  }

  @Effect()
  extendToolbarItems(): () => void {
    return this.plugins.extend(
      ToolbarItems, 2,
      (base: ToolbarItemType[]) => {
        if (isVisibleEditing(this.props)) {
          return this.plugins.getValue(Grid)
            .getController('editing')
            .prepareEditButtons({ _getToolbarButtonClass: () => {} })
            .map((item) => ({ ...item, props: item.options, templateType: Button }))
            .concat(base);
        } return base;
      },
    );
  }
}
