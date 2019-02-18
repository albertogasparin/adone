/* eslint-env jest */

import React from 'react';
import { shallow, mount } from 'enzyme';

import { basketMock, storeMock } from '../../__tests__/mocks';
import BasketRegistry, {
  defaultRegistry,
  default as registryDefaultExport,
} from '../../registry';
import { createComponents } from '../creators';

const mockRegistry = {
  configure: jest.fn(),
  getBasket: jest.fn(),
  deleteBasket: jest.fn(),
};

jest.mock('../../registry', () => ({
  __esModule: true,
  default: jest.fn(),
  defaultRegistry: {
    configure: jest.fn(),
    getBasket: jest.fn(),
    deleteBasket: jest.fn(),
  },
}));

const mockOnContainerInitInner = jest.fn();
const mockOnContainerUpdateInner = jest.fn();
const { Subscriber, Container } = createComponents({
  initialState: basketMock.initialState,
  actions: basketMock.actions,
  onContainerInit: () => mockOnContainerInitInner,
  onContainerUpdate: () => mockOnContainerUpdateInner,
});

describe('Container', () => {
  beforeEach(() => {
    const getBasketReturn = {
      store: storeMock,
      actions: basketMock.actions,
    };
    defaultRegistry.getBasket.mockReturnValue(getBasketReturn);
    registryDefaultExport.mockImplementation(() => mockRegistry);
    mockRegistry.getBasket.mockReturnValue(getBasketReturn);
    storeMock.getState.mockReturnValue(basketMock.initialState);
  });

  describe('constructor', () => {
    it('should create local basket registry', () => {
      expect(BasketRegistry).not.toHaveBeenCalled();
      shallow(
        <Container>
          <div />
        </Container>
      );

      expect(BasketRegistry).toHaveBeenCalledWith('__local__');
    });
  });

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
        initialState: {},
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
        undefined
      );
      expect(defaultRegistry.getBasket).not.toHaveBeenCalled();
    });

    it('should get basket from global registry when isGlobal is set', () => {
      const children = <Subscriber>{() => null}</Subscriber>;
      const wrapper = mount(<Container isGlobal>{children}</Container>);
      expect(defaultRegistry.getBasket).toHaveBeenCalledWith(
        Subscriber.basketType,
        undefined
      );
      expect(wrapper.instance().registry.getBasket).not.toHaveBeenCalled();
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

    it('should call basket onContainerInit on first render', () => {
      const renderPropChildren = jest.fn().mockReturnValue(null);
      const children = <Subscriber>{renderPropChildren}</Subscriber>;
      mount(<Container defaultCount={5}>{children}</Container>);
      expect(mockOnContainerInitInner).toHaveBeenCalledWith(
        {
          getState: expect.any(Function),
          setState: expect.any(Function),
          actions: expect.any(Object),
          dispatch: expect.any(Function),
        },
        { defaultCount: 5 }
      );
      expect(mockOnContainerInitInner).toHaveBeenCalledTimes(1);
      expect(mockOnContainerUpdateInner).not.toHaveBeenCalled();
    });

    it('should call basket onContainerUpdate on re-render if props changed', () => {
      const renderPropChildren = jest.fn().mockReturnValue(null);
      const children = <Subscriber>{renderPropChildren}</Subscriber>;
      const wrapper = mount(<Container defaultCount={5}>{children}</Container>);
      wrapper.setProps({ defaultCount: 6 });
      expect(mockOnContainerInitInner).toHaveBeenCalledTimes(1);
      expect(mockOnContainerUpdateInner).toHaveBeenCalledWith(
        {
          getState: expect.any(Function),
          setState: expect.any(Function),
          actions: expect.any(Object),
          dispatch: expect.any(Function),
        },
        { defaultCount: 6 }
      );
    });

    it('should pass props to subscriber actions', () => {
      const actionInner = jest.fn();
      basketMock.actions.increase.mockReturnValue(actionInner);
      const renderPropChildren = jest.fn().mockReturnValue(null);
      const children = <Subscriber>{renderPropChildren}</Subscriber>;
      mount(<Container defaultCount={5}>{children}</Container>);
      const [, { increase }] = renderPropChildren.mock.calls[0];
      increase();
      expect(actionInner).toHaveBeenCalledWith(
        {
          getState: expect.any(Function),
          setState: expect.any(Function),
          actions: expect.any(Object),
          dispatch: expect.any(Function),
        },
        { defaultCount: 5 }
      );
    });

    it('should pass fresh props to subscriber actions when they change', () => {
      const actionInner = jest.fn();
      basketMock.actions.increase.mockReturnValue(actionInner);
      const renderPropChildren = jest.fn().mockReturnValue(null);
      const children = <Subscriber>{renderPropChildren}</Subscriber>;
      const wrapper = mount(<Container defaultCount={5}>{children}</Container>);
      const [, { increase }] = renderPropChildren.mock.calls[0];
      wrapper.setProps({ defaultCount: 6 });
      increase();
      expect(actionInner).toHaveBeenCalledWith(
        {
          getState: expect.any(Function),
          setState: expect.any(Function),
          actions: expect.any(Object),
          dispatch: expect.any(Function),
        },
        { defaultCount: 6 }
      );
    });
  });
});
