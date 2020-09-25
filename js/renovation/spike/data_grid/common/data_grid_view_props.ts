import { ComponentBindings, OneWay } from 'devextreme-generator/component_declaration/common';
import { DataGridProps } from '../../../ui/data_grid/props';
import { GridInstance } from './types';

@ComponentBindings()
export class DataGridViewProps {
  @OneWay() gridInstance!: GridInstance;

  @OneWay() gridProps!: DataGridProps;
}
