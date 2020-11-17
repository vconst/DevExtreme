import {
  Ref, Effect, Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import LegacyDataGrid from '../../../ui/data_grid/ui.data_grid';

import { DataGridProps } from './props';

export const viewFunction = ({ widgetRef, props: { className }, restAttributes }: DataGrid) => (
  <div
    ref={widgetRef as any}
    className={className}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})
export class DataGrid extends JSXComponent(DataGridProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  widget: any;

  @Effect()
  updateWidget(): void {
    this.widget?.option(this.properties);
  }

  @Effect({ run: 'once' })
  setupWidget(): () => void {
    const widget = new LegacyDataGrid(this.widgetRef, this.properties);

    this.widget = widget;
    return (): void => {
      widget.dispose();
    };
  }

  get properties(): any /* Options */ {
    return this.props;
  }
}
