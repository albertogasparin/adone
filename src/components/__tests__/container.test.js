/* eslint-env jest */

import React from 'react';
import { shallow, mount } from 'enzyme';

import { basketMock, storeMock } from '../../__tests__/mocks';
import { defaultRegistry } from '../../registry';
import { createComponents } from '../creators';

const mockRegistry = {
  configure: jest.fn(),
  getBasket: jest.fn(),
  deleteBasket: jest.fn(),
};

jest.mock('../../registry', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockRegistry),
  defaultRegistry: {
    configure: jest.fn(),
    getBasket: jest.fn(),
    deleteBasket: jest.fn(),
  },
}));

const { Subscriber, Container } = createComponents({
  defaultState: basketMock.defaultState,
  actions: basketMock.actions,
});

describe('Scope', () => {
  describe('render', () => {
    it('should render context provider with value prop and children', () => {
      const children = <div />;
      const wrapper = shallow(<Container>{children}</Container>);
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
      const children = <Subscriber>{() => null}</Subscriber>;
      const wrapper = mount(<Container scope="s1">{children}</Container>);
      expect(defaultRegistry.getBasket).toHaveBeenCalledWith(
        Subscriber.basketType,
        's1'
      );
      expect(wrapper.instance().registry.getBasket).not.toHaveBeenCalled();
    });

    it('should get closer basket with scope id if matching', () => {
      const children = <Subscriber>{() => null}</Subscriber>;
      const { Container: OtherContainer } = createComponents({
        defaultState: {},
        actions: {},
      });
      mount(
        <Container scope="s1">
          <Container scope="s2">
            <OtherContainer scope="s3">
              <OtherContainer>{children}</OtherContainer>
            </OtherContainer>
          </Container>
        </Container>
      );
      expect(defaultRegistry.getBasket).toHaveBeenCalledWith(
        Subscriber.basketType,
        's2'
      );
    });

    it('should get local basket if local matching', () => {
      const children = <Subscriber>{() => null}</Subscriber>;
      const wrapper = mount(<Container>{children}</Container>);
      expect(wrapper.instance().registry.getBasket).toHaveBeenCalledWith(
        Subscriber.basketType,
        '__local__'
      );
      expect(defaultRegistry.getBasket).not.toHaveBeenCalled();
    });

    it('should cleanup from global on unmount if no more listeners', () => {
      storeMock.subscribe.mockReturnValue(jest.fn());
      storeMock.listeners.mockReturnValue([]);
      const children = <Subscriber>{() => null}</Subscriber>;
      const wrapper = mount(<Container scope="s1">{children}</Container>);
      wrapper.unmount();
      expect(defaultRegistry.deleteBasket).toHaveBeenCalledWith(
        Subscriber.basketType,
        's1'
      );
    });

    it('should not cleanup from global on unmount if still listeners', () => {
      storeMock.subscribe.mockReturnValue(jest.fn());
      storeMock.listeners.mockReturnValue([jest.fn()]);
      const children = <Subscriber>{() => null}</Subscriber>;
      const wrapper = mount(<Container scope="s1">{children}</Container>);
      wrapper.unmount();
      expect(defaultRegistry.deleteBasket).not.toHaveBeenCalled();
    });

    it('should cleanup from global on id change if no more listeners', () => {
      storeMock.subscribe.mockReturnValue(jest.fn());
      storeMock.listeners.mockReturnValue([]);
      const children = <Subscriber>{() => null}</Subscriber>;
      const wrapper = mount(<Container scope="s1">{children}</Container>);
      wrapper.setProps({ scope: 's2' });
      expect(defaultRegistry.deleteBasket).toHaveBeenCalledWith(
        Subscriber.basketType,
        's1'
      );
    });
  });
});
