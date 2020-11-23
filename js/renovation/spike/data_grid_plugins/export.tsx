// import {
//  JSXComponent, ComponentBindings, OneWay, Template, Component, Ref, Fragment,
// } from 'devextreme-generator/component_declaration/common';
import {
  JSXComponent, Component, Effect, Consumer, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { ToolbarItemType } from '../view-extenders/extender_types';

import { Button } from '../../ui/button';

import { ToolbarItems } from './toolbar';
import { Plugins, PluginsContext } from '../plugins/context';
import { DataGridExport } from '../../ui/data_grid/props';
import { Grid } from '../data_grid/data_grid';

const viewFunction = (): JSX.Element => <Fragment />;

@Component({ defaultOptionRules: null, view: viewFunction })
export default class Export extends JSXComponent<DataGridExport>() {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect()
  updateOptions(): void {
    this.plugins.getValue(Grid).option('export', this.props);
  }

  get exportToolbarItems(): ToolbarItemType[] {
    return [{
      name: 'export',
      location: 'after',
      templateType: Button,
      props: {
        text: 'Export',
        onClick: (): void => {
          this.plugins.getValue(Grid).getController('export').exportToExcel();
        },
      },
    }];
  }

  getToolbarItems(base: ToolbarItemType[]): ToolbarItemType[] {
    if (this.props.enabled) {
      return base.concat(this.exportToolbarItems);
    }
    return base;
  }

  @Effect()
  extendToolbarItems(): () => void {
    return this.plugins.extend(
      ToolbarItems, 3, this.getToolbarItems,
    );
  }
}
