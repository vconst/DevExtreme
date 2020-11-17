import {
  JSXComponent, Component, ComponentBindings, OneWay, Fragment, Slot,
} from 'devextreme-generator/component_declaration/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = (viewModel: GroupPanelItemSorting) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Fragment>
    {viewModel.props.children}
    (
    {viewModel.props.column.sortOrder || 'asc'}
    )
  </Fragment>
);

@ComponentBindings()
export class SortingProps {
  @OneWay() column: any;

  @Slot() children?: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class GroupPanelItemSorting extends JSXComponent<SortingProps>() {
}
