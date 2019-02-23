/* eslint-env jest */

import React, { Component } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { basketMock, storeMock } from '../../__tests__/mocks';
import { createHook } from '../hook';
import { defaultRegistry } from '../../registry';

jest.mock('../../registry', () => {
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

describe('Hook', () => {
  const actions = {
    increase: expect.any(Function),
    decrease: expect.any(Function),
  };

  const setup = (props = {}, selector) => {
    const childrenFn = jest.fn().mockReturnValue(null);
    const useHook = createHook(basketMock, selector);
    const Subscriber = ({ children, ...p }) => {
      const [s, a] = useHook(p);
      return children(s, a);
    };
    const getElement = () => <Subscriber {...props}>{childrenFn}</Subscriber>;
    // const getShallow = () => shallow(getElement());
    const getMount = () => mount(getElement());
    return {
      getElement,
      // getShallow,
      getMount,
      children: childrenFn,
    };
  };

  beforeEach(() => {
    defaultRegistry.getBasket.mockReturnValue({
      store: storeMock,
      actions: basketMock.actions,
    });
    storeMock.getState.mockReturnValue(basketMock.initialState);
    // this is a hack to get useEffect run sync, otherwise it might not get called
    jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect);
  });

  afterEach(() => {
    React.useEffect.mockRestore();
  });

  it('should get the basket instance from registry', () => {
    const { getMount } = setup();
    getMount();
    // we check defaultRegistry even when provider is used
    // as the mock is the same
    expect(defaultRegistry.getBasket).toHaveBeenCalledWith(basketMock);
  });

  it('should render children with basket data and actions', () => {
    const { getMount, children } = setup();
    getMount();
    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith({ count: 0 }, actions);
  });

  it('should update when store calls update listener', () => {
    const { getMount, children } = setup();
    storeMock.getState.mockReturnValue({ count: 1 });
    getMount();

    expect(storeMock.subscribe).toHaveBeenCalled();
    const newState = { count: 2 };
    storeMock.getState.mockReturnValue(newState);
    const update = storeMock.subscribe.mock.calls[0][0];
    act(() => update(newState));

    expect(children).toHaveBeenCalledTimes(2);
    expect(children).toHaveBeenCalledWith({ count: 1 }, actions);
    expect(children).toHaveBeenLastCalledWith({ count: 2 }, actions);
  });

  it('should avoid re-render children when just rendered from parent update', () => {
    const { getElement, children } = setup();
    class App extends Component {
      render() {
        return getElement();
      }
    }
    const wrapper = mount(<App />);
    // simulate store change -> parent re-render -> yield listener update
    const newState = { count: 1 };
    storeMock.getState.mockReturnValue(newState);
    wrapper.setProps({ foo: 1 });
    const update = storeMock.subscribe.mock.calls[0][0];
    act(() => update(newState));

    expect(storeMock.getState).toHaveBeenCalledTimes(3);
    expect(children).toHaveBeenCalledTimes(3);
    expect(children).toHaveBeenCalledWith(newState, actions);
  });

  it('should remove listener from store on unmount', () => {
    const { getMount } = setup();
    const unsubscribeMock = jest.fn();
    storeMock.subscribe.mockReturnValue(unsubscribeMock);
    const wrapper = getMount();
    wrapper.unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it('should render children with selected return value', () => {
    const selector = jest.fn().mockReturnValue({ foo: 1 });
    const { getMount, children } = setup({ prop: 1 }, selector);
    getMount();
    expect(selector).toHaveBeenCalledWith(basketMock.initialState, { prop: 1 });
    expect(children).toHaveBeenCalledWith({ foo: 1 }, actions);
  });

  it('should re-render children with selected return value', () => {
    const selector = jest.fn().mockReturnValue({ foo: 1 });
    const { getMount, children } = setup({}, selector);
    getMount();
    const newState = { count: 1 };
    selector.mockReturnValue({ foo: 2 });
    storeMock.getState.mockReturnValue(newState);
    const update = storeMock.subscribe.mock.calls[0][0];
    act(() => update(newState));
    expect(children).toHaveBeenLastCalledWith({ foo: 2 }, actions);
  });

  it('should not update on state change if selector output is equal', () => {
    const selector = jest.fn().mockReturnValue({ foo: 1 });
    const { getMount, children } = setup({}, selector);
    getMount();
    const newState = { count: 1 };
    storeMock.getState.mockReturnValue(newState);
    const update = storeMock.subscribe.mock.calls[0][0];
    act(() => update(newState));

    expect(children).toHaveBeenCalledTimes(1);
    // check that on state change memoisation breaks
    expect(selector).toHaveBeenCalledTimes(2);
  });

  it('should not update on state change if selector is null', () => {
    const selector = null;
    const { getMount, children } = setup({}, selector);
    getMount();

    const newState = { count: 1 };
    storeMock.getState.mockReturnValue(newState);
    const update = storeMock.subscribe.mock.calls[0][0];
    act(() => update(newState));

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith({}, actions);
  });
});
