import {
  JSXComponent, Component, ComponentBindings, OneWay, Fragment,
} from 'devextreme-generator/component_declaration/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  // eslint-disable-next-line react/prop-types
  currentComponent: CurrentComponent, props: { componentTypes, column, index },
}: PlaceholderItem) => (
  <Fragment>
    {
  CurrentComponent
  && (
  <CurrentComponent
    column={column}
  >
    <PlaceholderItem componentTypes={componentTypes} column={column} index={index + 1} />
  </CurrentComponent>
  )
}
  </Fragment>
);

@ComponentBindings()
export class PlaceholderItemProps {
  @OneWay() componentTypes: any[] = [];

  @OneWay() column: any;

  @OneWay() index = 0;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PlaceholderItem extends JSXComponent<PlaceholderItemProps>() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get currentComponent(): any {
    return this.props.componentTypes[this.props.index];
  }
}
