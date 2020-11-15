// import {
//  JSXComponent, ComponentBindings, OneWay, Template, Component, Ref, Fragment,
// } from 'devextreme-generator/component_declaration/common';
import {
  JSXComponent, Component, Effect, Consumer, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
// import { HeaderPanelExtender, ToolbarItemType, ViewExtender } from './extender_types';
import { ToolbarItemType } from './extender_types';

import { Button } from '../../ui/button';
// import { GridInstance } from '../data_grid/common/types';
// import { DataGridProps } from 'js/renovation/ui/data_grid/props';

import { ToolbarItems } from './header_panel_getters';
import { Plugins, PluginsContext } from '../plugins/context';
import { DataGridEditing } from '../../ui/data_grid/props';

const EDIT_MODE_BATCH = 'batch';

const isVisibleEditing = (editingOptions: DataGridEditing | undefined): boolean => !!(editingOptions
  && (editingOptions.allowAdding
    || ((editingOptions.allowUpdating || editingOptions.allowDeleting)
        && editingOptions.mode === EDIT_MODE_BATCH))
);

const viewFunction = (): JSX.Element => <Fragment />;

@Component({ defaultOptionRules: null, view: viewFunction })
export class HeaderPanelEditing extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect({ run: 'once' })
  extendToolbarItems(): void {
    return this.plugins.extend(
      ToolbarItems,
      (base: ToolbarItemType[]) => {
        if (isVisibleEditing(this.props.gridProps.editing)) {
          return this.props.gridInstance
            .getController('editing')
            .prepareEditButtons({ _getToolbarButtonClass: () => {} })
            .map((item) => ({ ...item, props: item.options, templateType: Button }))
            .concat(base);
        } return base;
      },
    );
  }
}
