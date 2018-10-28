/* eslint-env jest */

import { basketMock } from './mocks';
import createStore from '../create-store';

describe('createStore', () => {
  it('should return a store object', () => {
    const store = createStore(basketMock.key, basketMock.defaultState);
    expect(store).toEqual({
      key: basketMock.key,
      getState: expect.any(Function),
      setState: expect.any(Function),
      subscribe: expect.any(Function),
      listeners: expect.any(Function),
      produce: expect.any(Function),
    });
  });

  describe('getState()', () => {
    it('should return current state', () => {
      const store = createStore(basketMock.key, basketMock.defaultState);
      expect(store.getState()).toBe(basketMock.defaultState);
    });
  });

  describe('setState()', () => {
    it('should replace current state', () => {
      const store = createStore(basketMock.key, basketMock.defaultState);
      const newState = { count: 1 };
      store.setState(newState);
      expect(store.getState()).toBe(newState);
    });

    it('should notify listeners', () => {
      const store = createStore(basketMock.key, basketMock.defaultState);
      const newState = { count: 1 };
      const listener = jest.fn();
      store.subscribe(listener);
      store.setState(newState);
      expect(listener).toHaveBeenCalled();
    });
  });

  describe('off()', () => {
    it('should remove listener', () => {
      const store = createStore(basketMock.key, basketMock.defaultState);
      const newState = { count: 1 };
      const listener = jest.fn();
      const unsubscribe = store.subscribe(listener);
      unsubscribe();
      store.setState(newState);
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('produce()', () => {
    it('should modify state', () => {
      const store = createStore(basketMock.key, basketMock.defaultState);
      store.produce(draft => {
        draft.count += 1;
      });
      expect(store.getState()).toEqual({ count: 1 });
    });
  });
});
