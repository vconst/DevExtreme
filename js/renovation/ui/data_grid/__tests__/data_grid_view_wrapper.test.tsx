import { createRef } from 'react';
import { mount } from 'enzyme';
import { DataGridViewWrapper, viewFunction } from '../data_grid_view_wrapper';
import $ from '../../../../core/renderer';

describe('DataGridViews', () => {
  describe('View', () => {
    it('default render', () => {
      const widgetRef = createRef();
      const props = {
        widgetRef,
      } as any;
      const tree = mount(viewFunction(props));

      expect(tree.find('div').instance()).toBe(widgetRef.current);
    });
  });

  describe('Logic', () => {
    it('Render view', () => {
      const widgetRef = createRef() as any;
      const view = {
        render: jest.fn(),
      };
      const props = {
        view,
      } as any;
      const component = new DataGridViewWrapper(props);
      component.widgetRef = widgetRef;

      component.renderView();

      expect(component.props.view).toMatchObject({
        _$element: $(widgetRef),
      });
      expect((component.props.view.render)).toHaveBeenCalledTimes(1);
    });
  });
});
