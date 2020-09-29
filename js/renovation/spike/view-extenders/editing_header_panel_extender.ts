// import {
//  JSXComponent, ComponentBindings, OneWay, Template, Component, Ref, Fragment,
// } from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';
// import { HeaderPanelExtender, ToolbarItemType, ViewExtender } from './extender_types';
import { ToolbarItemType } from './extender_types';

import { Button } from '../../ui/button';
// import { GridInstance } from '../data_grid/common/types';
// import { DataGridProps } from 'js/renovation/ui/data_grid/props';

import { isVisibleGetter, getToolbarItemsGetter } from './header_panel_getters';

const EDIT_MODE_BATCH = 'batch';

/*
export const editHeaderPanelExtender: HeaderPanelExtender & ViewExtender = {
  // TODO Vitik copy from editing. map is not fully correct
  getToolbarItems: (gridInstance: DataGridViewProps['gridInstance']) => gridInstance
    .getController('editing')
    .prepareEditButtons({ _getToolbarButtonClass: () => {} })
    .map((item) => ({ ...item, props: item.options, templateType: Button } as ToolbarItemType))
    .concat(base.getToolbarItems(gridInstance, base)),
  isVisible: (gridProps: DataGridViewProps['gridProps']) => {
    const editingOptions = gridProps.editing;
    return base.isVisible(gridProps, base) || !!(editingOptions
      && (editingOptions.allowAdding
        || ((editingOptions.allowUpdating || editingOptions.allowDeleting)
            && editingOptions.mode === EDIT_MODE_BATCH))
    );
  },
}; */

getToolbarItemsGetter.register((
  gridView: DataGridViewProps,
  base: Function,
): [] => gridView.gridInstance
  .getController('editing')
  .prepareEditButtons({ _getToolbarButtonClass: () => {} })
  .map((item) => ({ ...item, props: item.options, templateType: Button } as ToolbarItemType))
  .concat(base()));

isVisibleGetter.register((
  gridView: DataGridViewProps,
  base: Function,
): boolean => {
  const editingOptions = gridView.gridProps.editing;
  return base() || !!(editingOptions
    && (editingOptions.allowAdding
      || ((editingOptions.allowUpdating || editingOptions.allowDeleting)
          && editingOptions.mode === EDIT_MODE_BATCH))
  );
});
