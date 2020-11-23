/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  JSXComponent, Component, InternalState, Effect, Fragment, Consumer, ComponentBindings,
} from 'devextreme-generator/component_declaration/common';
import { Toolbox } from './toolbar/toolbox';
import { View } from '../view-extenders/view';
import { RenovatedViewInstance } from '../view-extenders/view_instance';
import { ToolbarItemType } from '../view-extenders/extender_types';

import { Plugins, PluginsContext, createGetter } from '../plugins/context';
import { PlaceholderExtender } from '../plugins/placeholder_extender';
import { HeaderPanelPlaceholder } from '../data_grid/data_grid_header_panel_view';
import { Grid } from '../data_grid/data_grid';

export const ToolbarItems = createGetter<ToolbarItemType[]>([]);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  toolbarItems, isVisible,
}: HeaderPanelView) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Fragment>
    <PlaceholderExtender
      type={HeaderPanelPlaceholder}
      order={1}
      template={(): JSX.Element => (
        <View isVisible={isVisible}>
          <Toolbox
            items={(toolbarItems
              .map(({
                location, name, props, templateType: ItemTemplate,
              }) => ({
                location,
                name,
                template: props
                // eslint-disable-next-line react/jsx-props-no-spreading
                  ? () => (<ItemTemplate key={name} {...props} />)
                  : ItemTemplate,
              }))
      )}
          />
        </View>
      )}
    />
  </Fragment>
);

@ComponentBindings()
export class ToolbarProps {
}

@Component({ defaultOptionRules: null, view: viewFunction })
export default class HeaderPanelView extends JSXComponent<ToolbarProps>() {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @InternalState() toolbarItems: ToolbarItemType[] = [];

  get viewInstance(): RenovatedViewInstance & { setToolbarItemDisabled: (i, b) => void} {
    const viewInstance = this.plugins.getValue(Grid).getView('headerPanel');
    return viewInstance;
  }

  @Effect()
  updateToolbarItems() {
    return this.plugins.watch(ToolbarItems, (items) => {
      this.toolbarItems = items;
    });
  }

  get isVisible() {
    return this.toolbarItems.length > 0;
  }

  setToolbarItemDisabled(itemName: string, disabled: boolean) {
    let needUpdate = false;
    const items = this.toolbarItems?.map((item) => {
      if (item.name === itemName && item.props?.disabled !== disabled) {
        needUpdate = true;
        return {
          ...item,
          props: { ...item.props, disabled },
        };
      }
      return item;
    }) as ToolbarItemType[] || [];
    if (needUpdate) {
      console.log('updated items', itemName, items);
      this.toolbarItems = items;
    }
  }

  @Effect() extendViewInstance() {
    this.viewInstance.setToolbarItemDisabled = this.setToolbarItemDisabled;
  }
}
