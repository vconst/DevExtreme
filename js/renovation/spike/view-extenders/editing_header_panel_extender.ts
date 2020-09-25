import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
import { HeaderPanelExtender, ToolbarItemType, ViewExtender } from './extender_types';
import { Button } from '../../ui/button';

const EDIT_MODE_BATCH = 'batch';
export const editHeaderPanelExtender: HeaderPanelExtender & ViewExtender = {
  // TODO Vitik copy from editing. map is not fully correct
  getToolbarItems: (gridInstance: DataGridViewProps['gridInstance']) => gridInstance
    .getController('editing')
    .prepareEditButtons(this)
    .map((item) => ({ ...item, props: item.options, templateType: Button } as ToolbarItemType)),
  isVisible: (gridProps: DataGridViewProps['gridProps']) => {
    const editingOptions = gridProps.editing;
    return !!(editingOptions
      && (editingOptions.allowAdding
        || ((editingOptions.allowUpdating || editingOptions.allowDeleting)
            && editingOptions.mode === EDIT_MODE_BATCH))
    );
  },
};
