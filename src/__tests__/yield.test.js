/* eslint-env jest */

import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';

import { basketMock, storeMock } from './mocks';
import Yield from '../yield';
import YieldProvider from '../yield-provider';
import { defaultRegistry } from '../registry';

jest.mock('../registry', () => {
  const mockRegistry = {
    configure: jest.fn(),
    getBasket: jest.fn(),
  };
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => mockRegistry),
    defaultRegistry: mockRegistry,
  };
});

describe('Yield', () => {
  const children = jest.fn().mockReturnValue(null);

  const modes = {
    withProvider: (props = {}) => {
      const getElement = () => (
        <YieldProvider>
          <Yield from={basketMock} {...props}>
            {children}
          </Yield>
        </YieldProvider>
      );
      const getShallow = () =>
        shallow(getElement())
          .childAt(0)
          .shallow();
      const getMount = () => mount(getElement()).childAt(0);
      return {
        getElement,
        getShallow,
        getMount,
        children,
      };
    },
    withoutProvider: (props = {}) => {
      const getElement = () => (
        <Yield from={basketMock} {...props}>
          {children}
        </Yield>
      );
      const getShallow = () => shallow(getElement());
      const getMount = () => mount(getElement());
      return {
        getElement,
        getShallow,
        getMount,
        children,
      };
    },
  };

  Object.keys(modes).forEach(key => {
    const setup = modes[key];
    describe(key, () => {
      beforeEach(() => {
        defaultRegistry.getBasket.mockReturnValue({
          store: storeMock,
          actions: basketMock.actions,
        });
        storeMock.getState.mockReturnValue(basketMock.defaultState);
      });

      it('should get the basket instance from registry', () => {
        const { getShallow } = setup();
        getShallow();
        // we check defaultRegistry even when provider is used
        // as the mock is the same
        expect(defaultRegistry.getBasket).toHaveBeenCalledWith(basketMock);
      });

      it('should save basket instance locally and listen', () => {
        const { getShallow } = setup();
        const instance = getShallow().instance();
        expect(instance.basket).toEqual({
          actions: expect.any(Object),
          store: storeMock,
        });
        expect(storeMock.subscribe).toHaveBeenCalledWith(instance.onUpdate);
      });

      it('should render children with basket data and actions', () => {
        const { getShallow, children } = setup();
        getShallow();
        expect(children).toHaveBeenCalledTimes(1);
        expect(children).toHaveBeenCalledWith({
          count: 0,
          increase: expect.any(Function),
          decrease: expect.any(Function),
        });
      });

      it('should update when store calls update listener', () => {
        const { getMount } = setup();
        const instance = getMount().instance();
        instance.forceUpdate = jest.fn();
        storeMock.getState.mockReturnValue({ count: 1 });
        instance.onUpdate();
        expect(instance.state).toEqual({ count: 1 });
        expect(instance.forceUpdate).toHaveBeenCalled();
      });

      it('should avoid re-render children just rendered from parent update', () => {
        const { getElement, children } = setup();
        class App extends Component<{}> {
          render() {
            return getElement();
          }
        }
        const wrapper = mount(<App />);
        // simulate store change -> parent re-render -> yield listener update
        storeMock.getState.mockReturnValue({ count: 1 });
        wrapper.setProps({ foo: 1 });
        wrapper
          .find(Yield)
          .instance()
          .onUpdate();

        expect(storeMock.getState).toHaveBeenCalledTimes(4);
        expect(children).toHaveBeenCalledTimes(2);
        expect(children).toHaveBeenLastCalledWith({
          count: 1,
          increase: expect.any(Function),
          decrease: expect.any(Function),
        });
      });

      it('should remove listener from store on unmount', () => {
        const { getMount } = setup();
        const unsubscribeMock = jest.fn();
        storeMock.subscribe.mockReturnValue(unsubscribeMock);
        const instance = getMount().instance();
        expect(instance.subscription).toEqual({
          basket: instance.basket,
          remove: unsubscribeMock,
        });
        instance.componentWillUnmount();
        expect(unsubscribeMock).toHaveBeenCalled();
      });

      it('should render children with pick return value', () => {
        const pick = jest.fn().mockReturnValue({ foo: 1 });
        const { getMount, children } = setup({ pick, withProps: { prop: 1 } });
        getMount();
        expect(pick).toHaveBeenCalledWith(basketMock.defaultState, { prop: 1 });
        expect(children).toHaveBeenCalledWith({
          foo: 1,
          increase: expect.any(Function),
          decrease: expect.any(Function),
        });
      });
    });
  });
});
