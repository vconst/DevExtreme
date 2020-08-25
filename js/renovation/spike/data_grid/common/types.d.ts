
import { ComponentBindings, OneWay } from 'devextreme-generator/component_declaration/common';
import { DataGridComponent } from '../datagrid_component';
import { DataGridProps } from '../../../ui/data_grid/props';

export type GridInstance = (DataGridComponent & {
  getView(name: string): any;
  getController(name: string): any;
});


export type DataGridView = {
  name: string;
  _$element;
  render();
  //update();
};

@ComponentBindings()
export class DataGridViewProps {
  @OneWay() gridInstance: GridInstance;
  @OneWay() gridProps: DataGridProps;
}
