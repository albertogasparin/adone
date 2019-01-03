/* eslint-env jest */

import { createComponents, createSelector } from '../creators';

describe('creators', () => {
  describe('createComponents', () => {
    it('should return components', () => {
      const { Container, Subscriber } = createComponents({
        defaultState: {},
        actions: {},
      });
      expect(Container.basketType).toBeDefined();
      expect(Subscriber.basketType).toBeDefined();
    });

    it('should return named components', () => {
      const { Container, Subscriber } = createComponents({
        defaultState: {},
        actions: {},
        name: 'test',
      });
      expect(Container.displayName).toEqual('Container(test)');
      expect(Subscriber.displayName).toEqual('Subscriber(test)');
    });
  });
  describe('createSelector', () => {
    it('should return a component with selector', () => {
      const selectorMock = jest.fn();
      const { Subscriber } = createComponents({
        defaultState: {},
        actions: {},
        name: 'test',
      });
      const SubscriberSelector = createSelector(Subscriber, selectorMock);
      expect(SubscriberSelector.basketType).toEqual(Subscriber.basketType);
      expect(SubscriberSelector.displayName).toEqual(
        'SubscriberSelector(test)'
      );
      expect(SubscriberSelector.selector).toEqual(selectorMock);
    });
  });
});
