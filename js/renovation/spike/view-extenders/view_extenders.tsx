// import {
//   JSXComponent, Component, ComponentBindings, OneWay, Template,
// } from 'devextreme-generator/component_declaration/common';
// import { DataGridViewProps } from '../data_grid/common/data_grid_view_props';

// // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// export const viewFunction = ({
//   props: { viewType: View, gridInstance, gridProps },
// }: ViewExtender) => (
//   <View gridInstance={gridInstance} gridProps={gridProps} />
// );

// @ComponentBindings()
// export class ViewExtenderProps extends DataGridViewProps {
//   @Template() viewType: any;

//   @OneWay() extenders!: {}[];
// }

// @Component({ defaultOptionRules: null, view: viewFunction })
// export class ViewExtender extends JSXComponent<ViewExtenderProps>() {
// }
