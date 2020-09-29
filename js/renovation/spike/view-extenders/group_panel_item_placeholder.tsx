import {
  JSXComponent, Component, ComponentBindings, OneWay, Fragment,
} from 'devextreme-generator/component_declaration/common';

import { GroupPanelItem } from './group_panel_item';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  // eslint-disable-next-line react/prop-types
  currentComponent: CurrentComponent, props: { column, index },
}: GroupPanelItemPlaceholder) => (
  <Fragment>
    {
  CurrentComponent
  && (
  <CurrentComponent
    column={column}
    baseTemplate={() => <GroupPanelItemPlaceholder column={column} index={index + 1} />}
  />
  )
}
  </Fragment>
);

const componentTypes = [GroupPanelItem];

export const register = (componentType) => {
  componentTypes.unshift(componentType);
};

@ComponentBindings()
export class GroupPanelItemPlaceholderProps {
  @OneWay() column: any;

  @OneWay() index = 0;

  // @Template() base?: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class GroupPanelItemPlaceholder extends JSXComponent<GroupPanelItemPlaceholderProps>() {
  get currentComponent(): any {
    return componentTypes[this.props.index];
  }
}
