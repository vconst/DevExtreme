import {
  JSXComponent, Component, ComponentBindings,
} from 'devextreme-generator/component_declaration/common';
import { GroupPanelItemPlaceholder } from '../view-extenders/group_panel_item';
import { GroupPanelItemFilter } from '../view-extenders/group_panel_item_filtering';
import { PlaceholderExtender } from '../view-extenders/placeholder_extender';

const viewFunction = (): JSX.Element => (
  <PlaceholderExtender
    type={GroupPanelItemPlaceholder}
    order={2}
    template={GroupPanelItemFilter}
  />
);

@ComponentBindings()
export class FilteringProps {
}

@Component({ defaultOptionRules: null, view: viewFunction })
export default class Filtering extends JSXComponent<FilteringProps>() {}
