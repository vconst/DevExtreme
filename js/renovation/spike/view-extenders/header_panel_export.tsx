import {
  JSXComponent, Consumer, Effect, Fragment, Component,
} from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
// import { HeaderPanelExtender, ViewExtender } from './extender_types';
import { Button } from '../../ui/button';

import { ToolbarItems } from './header_panel_getters';
import { PluginsContext, Plugins } from '../plugins/context';
import { ToolbarItemType } from './extender_types';

const viewFunction = (): JSX.Element => <Fragment />;

@Component({ defaultOptionRules: null, view: viewFunction })
export class HeaderPanelExport extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect({ run: 'once' })
  extendToolbarItems(): void {
    return this.plugins.extend(
      ToolbarItems,
      (base: ToolbarItemType[]) => {
        if (this.props.gridProps.export?.enabled) {
          return base.concat([{
            name: 'export',
            location: 'after',
            templateType: Button,
            props: {
              text: 'Export',
              onClick: (): void => {
                this.props.gridInstance.getController('export').exportToExcel();
              },
            },
          }]);
        }
        return base;
      },
    );
  }
}
