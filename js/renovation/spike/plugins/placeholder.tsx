import {
  JSXComponent, Component, ComponentBindings, OneWay, Consumer, InternalState, Effect, Slot,
} from 'devextreme-generator/component_declaration/common';

import { PlaceholderItem } from './placeholder_item';
import {
  createPlaceholder, /* PluginPlaceholder, */ PluginsContext, Plugins,
} from './context';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  // eslint-disable-next-line react/prop-types
  componentTypes, props: { column, children },
}: Placeholder) => (
  <PlaceholderItem componentTypes={componentTypes} column={column}>
    {children}
  </PlaceholderItem>
);
@ComponentBindings()
export class GroupPanelItemPlaceholderProps {
  @OneWay() type!: any /* TODO PluginPlaceholder */;

  @OneWay() column: any;

  @Slot() children: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class Placeholder extends JSXComponent<GroupPanelItemPlaceholderProps>() {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @InternalState() componentTypes: any /* [] */ = [];

  @Effect()
  updateComponentTypes(): () => void {
    return this.plugins.watch(this.props.type, (items: { order: number; component: unknown }[]) => {
      this.componentTypes = items.map((item) => item.component).reverse();
    });
  }
}

export const GroupPanelItemPlaceholder = createPlaceholder();
