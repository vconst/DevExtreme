import { OneWay, ComponentBindings } from 'devextreme-generator/component_declaration/common';

export type ToolboxItemPositionType = 'before'|'after';

@ComponentBindings()
export class ToolboxItem {
  @OneWay() location: ToolboxItemPositionType = 'after';

  @OneWay() name?: string;

  @OneWay() template: any;
}
