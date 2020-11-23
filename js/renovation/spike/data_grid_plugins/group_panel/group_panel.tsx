import {
  JSXComponent, Component, InternalState, Effect, Consumer, ComponentBindings,
} from 'devextreme-generator/component_declaration/common';
import { GroupPanelItemPlaceholder } from './group_panel_item';
import { Placeholder } from '../../plugins/placeholder';
import { PluginsContext, Plugins } from '../../plugins/context';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

import { Grid } from '../../data_grid/data_grid';

export const viewFunction = ({ items }: GroupPanel): JSX.Element => (
  <div>
    {(items
      .map((column) => (
        <div className={column.cssClass}>
          <Placeholder type={GroupPanelItemPlaceholder} column={column}>
            { column.caption }
          </Placeholder>
        </div>
      )))}
  </div>
);

@ComponentBindings()
export class GroupPanelProps {
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class GroupPanel extends JSXComponent<GroupPanelProps>() {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @InternalState() groupingColumns;

  get items(): { caption: string; cssClass: string }[] {
    const groupColumns = this.groupingColumns || this.plugins.getValue(Grid).getController('columns').getGroupColumns();
    return groupColumns;
  }

  @Effect({ run: 'once' }) init(): void {
    const columnsController = this.plugins.getValue(Grid).getController('columns');
    columnsController.columnsChanged.add(() => {
      this.groupingColumns = this.plugins.getValue(Grid).getController('columns').getGroupColumns();
    });
  }
}
