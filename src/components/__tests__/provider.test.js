/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';

import AdoneProvider from '../provider';
import { StoreRegistry } from '../../store';

describe('AdoneProvider', () => {
  describe('render', () => {
    it('should render context provider with value prop and children', () => {
      const children = <div />;
      const wrapper = shallow(<AdoneProvider>{children}</AdoneProvider>);
      expect(wrapper.name()).toEqual('ContextProvider');
      expect(wrapper.props()).toEqual({
        children,
        value: {
          getStore: expect.any(Function),
          globalRegistry: expect.any(StoreRegistry),
        },
      });
    });
  });

  describe('state', () => {
    it('should have store registry in state', () => {
      const children = <div />;
      const instance = shallow(
        <AdoneProvider>{children}</AdoneProvider>
      ).instance();
      expect(instance.registry).toBeDefined();
      expect(instance.state.globalRegistry).toBe(instance.registry);
      expect(instance.state.getStore).toBe(instance.registry.getStore);
    });
  });
});
