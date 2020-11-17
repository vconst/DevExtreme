import {
  JSXComponent, Component, ComponentBindings, OneWay, Fragment, Slot,
} from 'devextreme-generator/component_declaration/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = (viewModel: GroupPanelItemFilter) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Fragment>
    {viewModel.props.children}
    (
    Filter
    )
  </Fragment>
);

@ComponentBindings()
export class FilteringProps {
  @OneWay() column: any;

  @Slot() children?: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class GroupPanelItemFilter extends JSXComponent<FilteringProps>() {
}
