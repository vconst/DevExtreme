import {
  JSXComponent, Component, ComponentBindings, Effect, Template, OneWay, Ref,
} from 'devextreme-generator/component_declaration/common';
import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  viewRef,
  props: { viewComponentTemplate: ViewComponent },
}: ViewRefWrapper) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ViewComponent componentRef={viewRef as any} />
);

@ComponentBindings()
export class ViewRefWrapperProps extends DataGridViewProps {
  @Template() viewComponentTemplate!: any;

  @OneWay() viewName!: string;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class ViewRefWrapper extends JSXComponent<ViewRefWrapperProps, 'viewComponentTemplate' | 'viewName' |'gridInstance'|'gridProps' >() {
  @Ref() viewRef;

  @Effect({ run: 'once' }) init() {
    console.log('setRefToComponent');
    const view = this.props.gridInstance.getView(this.props.viewName);
    if (view?.setRefToComponent) { view?.setRefToComponent?.(this.viewRef); }
  }
}
