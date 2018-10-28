/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';

import YieldProvider from '../yield-provider';
import BasketRegistry from '../registry';

describe('YieldProvider', () => {
  describe('render', () => {
    it('should render context provider with value prop and children', () => {
      const children = <div />;
      const wrapper = shallow(<YieldProvider>{children}</YieldProvider>);
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
        <YieldProvider>{children}</YieldProvider>
      ).instance();
      expect(instance.registry).toBeDefined();
      expect(instance.state.globalRegistry).toBe(instance.registry);
      expect(instance.state.getBasket).toBe(instance.registry.getBasket);
    });
  });
});
