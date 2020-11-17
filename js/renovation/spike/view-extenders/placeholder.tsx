import {
  JSXComponent, Component, ComponentBindings, OneWay, Consumer, InternalState, Effect,
} from 'devextreme-generator/component_declaration/common';

import { PlaceholderItem } from './placeholder_item';
import {
  createPlaceholder, /* PluginPlaceholder, */ PluginsContext, Plugins,
} from '../plugins/context';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  // eslint-disable-next-line react/prop-types
  componentTypes, props: { column },
}: Placeholder) => (
  <PlaceholderItem componentTypes={componentTypes} column={column} />
);
@ComponentBindings()
export class GroupPanelItemPlaceholderProps {
  @OneWay() type!: any /* TODO PluginPlaceholder */;

  @OneWay() column: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class Placeholder extends JSXComponent<GroupPanelItemPlaceholderProps>() {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @InternalState() componentTypes: any /* [] */ = [];

  @Effect()
  updateComponentTypes(): () => void {
    return this.plugins.watch(this.props.type, (componentTypes) => {
      this.componentTypes = componentTypes;
    });
  }
}

export const GroupPanelItemPlaceholder = createPlaceholder();
