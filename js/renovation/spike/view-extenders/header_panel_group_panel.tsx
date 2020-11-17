import {
  JSXComponent, Component, InternalState, Effect,
} from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
import { GroupPanelItemPlaceholder } from './group_panel_item';
import { Placeholder } from './placeholder';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

export const viewFunction = ({ items }: GroupPanel) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div>
    {(items
      .map((column) => (
        <div className={column.cssClass}>
          <Placeholder type={GroupPanelItemPlaceholder} column={column} />
        </div>
      )))}
  </div>
);

@Component({ defaultOptionRules: null, view: viewFunction })
export class GroupPanel extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
  @InternalState() groupingColumns;

  get items(): { caption: string; cssClass: string }[] {
    const groupColumns = this.groupingColumns || this.props.gridInstance.getController('columns').getGroupColumns();
    return groupColumns;
  }

  @Effect({ run: 'once' }) init() {
    const columnsController = this.props.gridInstance.getController('columns');
    columnsController.columnsChanged.add(() => {
      this.groupingColumns = this.props.gridInstance.getController('columns').getGroupColumns();
    });
  }
}
