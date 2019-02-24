/* eslint-env jest */

import { storeStateMock } from '../../__tests__/mocks';
import createStore from '../create-state';

describe('createStore', () => {
  it('should return a store object', () => {
    const store = createStore(storeStateMock.key, storeStateMock.initialState);
    expect(store).toEqual({
      key: storeStateMock.key,
      getState: expect.any(Function),
      setState: expect.any(Function),
      subscribe: expect.any(Function),
      listeners: expect.any(Function),
      mutator: expect.any(Function),
    });
  });

  describe('getState()', () => {
    it('should return current state', () => {
      const store = createStore(
        storeStateMock.key,
        storeStateMock.initialState
      );
      expect(store.getState()).toBe(storeStateMock.initialState);
    });
  });

  describe('setState()', () => {
    it('should replace current state', () => {
      const store = createStore(
        storeStateMock.key,
        storeStateMock.initialState
      );
      const newState = { count: 1 };
      store.setState(newState);
      expect(store.getState()).toBe(newState);
    });

    it('should notify listeners', () => {
      const store = createStore(
        storeStateMock.key,
        storeStateMock.initialState
      );
      const newState = { count: 1 };
      const listener = jest.fn();
      store.subscribe(listener);
      store.setState(newState);
      expect(listener).toHaveBeenCalled();
    });
  });

  describe('unsubscribe()', () => {
    it('should remove listener', () => {
      const store = createStore(
        storeStateMock.key,
        storeStateMock.initialState
      );
      const newState = { count: 1 };
      const listener = jest.fn();
      const unsubscribe = store.subscribe(listener);
      unsubscribe();
      store.setState(newState);
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('mutator()', () => {
    it('should modify state', () => {
      const store = createStore(
        storeStateMock.key,
        storeStateMock.initialState
      );
      store.mutator({
        count: 1,
      });
      expect(store.getState()).toEqual({ count: 1 });
    });
  });
});
