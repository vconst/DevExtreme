import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
import { ToolboxItemPositionType } from './toolbox_item';

export interface ViewExtender {
  isVisible: (gridProps: DataGridViewProps['gridProps']) => boolean;
}
export interface ToolbarItemType {
  location: ToolboxItemPositionType;
  name: string;
  props?: { disabled?: boolean; onClick: any };
  templateType: any;
}
export interface HeaderPanelExtender {
  getToolbarItems: (gridInstance: DataGridViewProps['gridInstance']) => ToolbarItemType[];
}
