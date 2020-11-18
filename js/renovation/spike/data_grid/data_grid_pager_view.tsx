/* eslint-disable react/jsx-props-no-spreading */
import {
  JSXComponent, Component,
} from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from './common/data_grid_view_props';
import { Placeholder } from '../view-extenders/placeholder';
import { createPlaceholder } from '../plugins/context';

export const PagerPlaceholder = createPlaceholder();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = () => (
  <Placeholder type={PagerPlaceholder} />
);

@Component({ defaultOptionRules: null, view: viewFunction })
export class DataGridPagerView
  extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
}
