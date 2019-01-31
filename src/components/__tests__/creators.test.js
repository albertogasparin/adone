/* eslint-env jest */

import ContainerClass from '../container';
import SubscriberClass from '../subscriber';
import { createComponents, createSelector } from '../creators';
import hash from '../../utils/hash';

jest.mock('../../utils/hash', () => ({
  __esModule: true,
  default: jest.fn(() => 'mockedHash'),
}));

describe('creators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createComponents', () => {
    it('should return a Subscriber component', () => {
      const updateFoo = () => {};
      const { Subscriber } = createComponents({
        initialState: {
          foo: 'bar',
        },
        actions: {
          updateFoo,
        },
        name: 'test',
      });

      expect(Subscriber.prototype).toBeInstanceOf(SubscriberClass);
      expect(Subscriber.displayName).toEqual('Subscriber(test)');
      expect(Subscriber.basketType).toEqual({
        key: ['test', 'mockedHash'],
        initialState: {
          foo: 'bar',
        },
        actions: {
          updateFoo,
        },
        onContainerInit: null,
        onContainerUpdate: null,
      });
      expect(hash).toHaveBeenCalledWith('{"foo":"bar"}');
    });

    it('should return a Container component', () => {
      const updateFoo = () => {};
      const { Container } = createComponents({
        initialState: {
          foo: 'bar',
        },
        actions: {
          updateFoo,
        },
        name: 'test',
      });

      expect(Container.prototype).toBeInstanceOf(ContainerClass);
      expect(Container.displayName).toEqual('Container(test)');
      expect(Container.basketType).toEqual({
        key: ['test', 'mockedHash'],
        initialState: {
          foo: 'bar',
        },
        actions: {
          updateFoo,
        },
        onContainerInit: null,
        onContainerUpdate: null,
      });
      expect(hash).toHaveBeenCalledWith('{"foo":"bar"}');
    });
  });
  describe('createSelector', () => {
    it('should return a component with selector', () => {
      const selectorMock = jest.fn();
      const { Subscriber } = createComponents({
        initialState: {},
        actions: {},
        name: 'test',
      });
      const SubscriberSelector = createSelector(
        Subscriber,
        selectorMock
      );
      expect(SubscriberSelector.basketType).toEqual(Subscriber.basketType);
      expect(SubscriberSelector.displayName).toEqual(
        'SubscriberSelector(test)'
      );
      expect(SubscriberSelector.selector).toEqual(selectorMock);
    });
  });
});
