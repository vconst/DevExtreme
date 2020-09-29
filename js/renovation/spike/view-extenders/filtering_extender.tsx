import {
  JSXComponent, Component, ComponentBindings, OneWay, Fragment, Template,
} from 'devextreme-generator/component_declaration/common';

// import { isVisibleGetter, getToolbarItemsGetter } from './header_panel_getters';

import { register } from './group_panel_item_placeholder';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = (viewModel: GroupPanelItemFilter) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Fragment>
    <viewModel.props.baseTemplate column={viewModel.props.column} />
    (
    Filter
    )
  </Fragment>
);

@ComponentBindings()
export class FilteringProps {
  @OneWay() column: any;

  @Template() baseTemplate?: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class GroupPanelItemFilter extends JSXComponent<FilteringProps>() {
}

register(GroupPanelItemFilter);
