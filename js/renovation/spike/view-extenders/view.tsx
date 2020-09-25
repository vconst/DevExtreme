import {
  Slot, JSXComponent, Component, ComponentBindings, OneWay,
} from 'devextreme-generator/component_declaration/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  className, props: { children },
}: View) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div className={className}>
    {children}
  </div>
);

@ComponentBindings()
export class ViewProps /* extends DataGridViewProps */ {
  @OneWay() isVisible = true;

  @Slot() children?: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class View extends JSXComponent<ViewProps>() {
  get className() {
    return this.props.isVisible ? '' : 'hidden';
  }
}
