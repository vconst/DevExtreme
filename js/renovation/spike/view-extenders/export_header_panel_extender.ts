import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
import { HeaderPanelExtender, ViewExtender } from './extender_types';
import { ToolboxItemPositionType } from './toolbox_item';
import { Button } from '../../ui/button';

export const exportHeaderPanelExtender: HeaderPanelExtender & ViewExtender = {
  isVisible: (gridProps: DataGridViewProps['gridProps']) => gridProps.export?.enabled || false,

  getToolbarItems: (gridInstance: DataGridViewProps['gridInstance']) => [{
    name: 'export',
    location: 'after' as ToolboxItemPositionType,
    templateType: Button,
    props: {
      text: 'Export',
      onClick: (): void => {
        gridInstance.getController('export').exportToExcel();
      },
    },
  }],
};
