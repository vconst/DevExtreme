/* import {
  JSXComponent, Component, ComponentBindings, OneWay, Fragment,
} from 'devextreme-generator/component_declaration/common';

// import { isVisibleGetter, getToolbarItemsGetter } from './header_panel_getters';

import { Placeholder } from './placeholder';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  componentTypes, props: { options },
}: PlaceholderView) => (
  componentTypes.map((Widget) => <Widget options={options} />)
);

@ComponentBindings()
export class PlaceholderViewProps {
  @OneWay() placeholder!: Placeholder;

  @OneWay() options: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PlaceholderView extends JSXComponent<PlaceholderViewProps>() {
  get componentTypes() {
    return this.props.placeholder.getComponentTypes();
  }
}
*/
