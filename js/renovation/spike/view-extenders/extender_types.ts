import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
import { ToolboxItemPositionType } from '../data_grid_plugins/toolbar/toolbox_item';

export interface ViewExtender {
  isVisible: (gridProps: DataGridViewProps['gridProps']) => boolean;
}
export interface ToolbarItemType {
  location: ToolboxItemPositionType;
  name: string;
  props?: { disabled?: boolean; onClick: any; text: string };
  templateType: any;
}
export interface HeaderPanelExtender {
  getToolbarItems: (gridInstance: DataGridViewProps['gridInstance']) => ToolbarItemType[];
}
