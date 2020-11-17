import {
  JSXComponent, Component, ComponentBindings, OneWay, Fragment, Slot,
} from 'devextreme-generator/component_declaration/common';
import { createPlaceholder } from '../plugins/context';

// import { isVisibleGetter, getToolbarItemsGetter } from './header_panel_getters';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  props: { column },
}: GroupPanelItem) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Fragment>
    { column.caption }
  </Fragment>
);

@ComponentBindings()
export class GroupPanelItemProps {
  @OneWay() column: any;

  @Slot() children?: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class GroupPanelItem extends JSXComponent<GroupPanelItemProps>() {
}

export const GroupPanelItemPlaceholder = createPlaceholder();
