import {
  JSXComponent, Component, ComponentBindings, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { GroupPanelItemPlaceholder } from './group_panel/group_panel_item';
import { PlaceholderExtender } from '../plugins/placeholder_extender';

const viewFunction = (): JSX.Element => (
  <PlaceholderExtender
    type={GroupPanelItemPlaceholder}
    order={2}
    template={(column, children): JSX.Element => (
      <Fragment>
        {children}
        {' '}
        (Filter)
      </Fragment>
    )}
  />
);

@ComponentBindings()
export class FilteringProps {
}

@Component({ defaultOptionRules: null, view: viewFunction })
export default class Filtering extends JSXComponent<FilteringProps>() {}
