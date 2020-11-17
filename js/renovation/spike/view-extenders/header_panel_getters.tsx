import { createGetter } from '../plugins/context';
import { ToolbarItemType } from './extender_types';

export const ToolbarItems = createGetter<ToolbarItemType[]>([]);
