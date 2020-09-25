
import { DataGridComponent } from '../datagrid_component';

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


