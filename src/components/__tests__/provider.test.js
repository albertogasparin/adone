/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';

import AdoneProvider from '../provider';
import BasketRegistry from '../../registry';

describe('AdoneProvider', () => {
  describe('render', () => {
    it('should render context provider with value prop and children', () => {
      const children = <div />;
      const wrapper = shallow(<AdoneProvider>{children}</AdoneProvider>);
      expect(wrapper.name()).toEqual('ContextProvider');
      expect(wrapper.props()).toEqual({
        children,
        value: {
          getBasket: expect.any(Function),
          globalRegistry: expect.any(BasketRegistry),
        },
      });
    });
  });

  describe('state', () => {
    it('should have basket registry in state', () => {
      const children = <div />;
      const instance = shallow(
        <AdoneProvider>{children}</AdoneProvider>
      ).instance();
      expect(instance.registry).toBeDefined();
      expect(instance.state.globalRegistry).toBe(instance.registry);
      expect(instance.state.getBasket).toBe(instance.registry.getBasket);
    });
  });
});
