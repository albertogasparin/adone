/* eslint-env jest */

import ContainerClass from '../container';
import SubscriberClass from '../subscriber';
import { createComponents, createSelectorComponent } from '../creators';
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
        onContainerInit: expect.any(Function),
        onContainerUpdate: expect.any(Function),
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
        onContainerInit: jest.fn(),
        onContainerUpdate: jest.fn(),
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
        onContainerInit: expect.any(Function),
        onContainerUpdate: expect.any(Function),
      });
      expect(hash).toHaveBeenCalledWith('{"foo":"bar"}');
    });
  });
  describe('createSelectorComponent', () => {
    it('should return a component with selector', () => {
      const selectorMock = jest.fn();
      const { Subscriber } = createComponents({
        initialState: {},
        actions: {},
        name: 'test',
      });
      const SubscriberSelector = createSelectorComponent(
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
