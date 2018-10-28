/* eslint-env jest */

import React from 'react';
import { shallow, mount } from 'enzyme';

import { basketMock, storeMock } from './mocks';
import YieldScope from '../yield-scope';
import { defaultRegistry } from '../registry';
import Yield from '../yield';

const mockRegistry = {
  getBasket: jest.fn(),
};

jest.mock('../registry', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockRegistry),
  defaultRegistry: { getBasket: jest.fn() },
}));

describe('YieldScope', () => {
  describe('render', () => {
    it('should render context provider with value prop and children', () => {
      const children = <div />;
      const wrapper = shallow(
        <YieldScope for={basketMock}>{children}</YieldScope>
      );
      expect(wrapper.name()).toEqual('ContextProvider');
      expect(wrapper.props()).toEqual({
        children,
        value: {
          getBasket: expect.any(Function),
          globalRegistry: expect.any(Object),
        },
      });
    });
  });

  describe('integration', () => {
    beforeEach(() => {
      const getBasketReturn = {
        store: storeMock,
        actions: basketMock.actions,
      };
      defaultRegistry.getBasket.mockReturnValue(getBasketReturn);
      mockRegistry.getBasket.mockReturnValue(getBasketReturn);
      storeMock.getState.mockReturnValue(basketMock.defaultState);
    });

    it('should get basket from global with scope id if matching', () => {
      const children = <Yield from={basketMock}>{() => null}</Yield>;
      const wrapper = mount(
        <YieldScope id="s1" for={basketMock}>
          {children}
        </YieldScope>
      );
      expect(defaultRegistry.getBasket).toHaveBeenCalledWith(basketMock, 's1');
      expect(wrapper.instance().registry.getBasket).not.toHaveBeenCalled();
    });

    it('should get closer basket with scope id if matching', () => {
      const children = <Yield from={basketMock}>{() => null}</Yield>;
      mount(
        <YieldScope id="s1" for={basketMock}>
          <YieldScope id="s2" for={basketMock}>
            <YieldScope id="s3" for={{ key: 'foo' }}>
              <YieldScope local for={{ key: 'bar' }}>
                {children}
              </YieldScope>
            </YieldScope>
          </YieldScope>
        </YieldScope>
      );
      expect(defaultRegistry.getBasket).toHaveBeenCalledWith(basketMock, 's2');
    });

    it('should get local basket if local matching', () => {
      const children = <Yield from={basketMock}>{() => null}</Yield>;
      const wrapper = mount(
        <YieldScope local for={basketMock}>
          {children}
        </YieldScope>
      );
      expect(wrapper.instance().registry.getBasket).toHaveBeenCalledWith(
        basketMock,
        'local'
      );
      expect(defaultRegistry.getBasket).not.toHaveBeenCalled();
    });
  });
});
