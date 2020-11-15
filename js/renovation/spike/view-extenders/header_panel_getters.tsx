// import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';

import { createGetter } from '../plugins/context';
import { ToolbarItemType } from './extender_types';

export const ToolbarItems = createGetter<ToolbarItemType[]>([]);
