/* eslint-disable react/jsx-props-no-spreading */
import {
  JSXComponent, Component,
} from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from './common/data_grid_view_props';
import { Placeholder } from '../plugins/placeholder';
import { createPlaceholder } from '../plugins/context';

export const HeaderPanelPlaceholder = createPlaceholder();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = () => (
  <Placeholder type={HeaderPanelPlaceholder} />
);

@Component({ defaultOptionRules: null, view: viewFunction })
export class DataGridHeaderPanelView
  extends JSXComponent<DataGridViewProps, 'gridInstance' | 'gridProps'>() {
}
