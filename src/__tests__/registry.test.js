/* eslint-env jest */

import { basketMock } from './mocks';
import BasketRegistry from '../registry';

describe('BasketRegistry', () => {
  it('should get and create a new basket', () => {
    const registry = new BasketRegistry();
    const instance = registry.getBasket(basketMock);
    expect(registry.baskets.size).toEqual(1);
    expect(instance).toEqual({
      actions: expect.any(Object),
      store: expect.any(Object),
    });
  });

  it('should get an existing basket if no scopeId provided', () => {
    const registry = new BasketRegistry();
    const instance1 = registry.getBasket(basketMock);
    const instance2 = registry.getBasket(basketMock);
    expect(registry.baskets.size).toEqual(1);
    expect(instance1).toBe(instance2);
  });

  it('should get an existing basket if scopeId matches', () => {
    const registry = new BasketRegistry();
    const instance1 = registry.getBasket(basketMock, 's1');
    const instance2 = registry.getBasket(basketMock, 's1');
    expect(registry.baskets.size).toEqual(1);
    expect(instance1).toBe(instance2);
  });

  it('should get and create a new basket if different scope', () => {
    const registry = new BasketRegistry();
    const instance1 = registry.getBasket(basketMock);
    const instance2 = registry.getBasket(basketMock, 's1');
    expect(registry.baskets.size).toEqual(2);
    expect(instance1).not.toBe(instance2);
  });

  it('should get and create a new basket with initial data', () => {
    const data = { [basketMock.key + '@__global__']: { count: 1 } };
    const registry = new BasketRegistry();
    registry.configure({ initialStates: data });
    const instance = registry.getBasket(basketMock);
    expect(instance.store.getState()).toEqual({ count: 1 });
  });

  it('should delete basket from registry', () => {
    const registry = new BasketRegistry();
    registry.getBasket(basketMock);
    registry.getBasket(basketMock, 's1');
    registry.deleteBasket(basketMock, 's1');
    expect(registry.baskets.size).toEqual(1);
  });

  describe('Basket keys', () => {
    it('should suffix defaultScope ctor arg for unscoped baskets', () => {
      const registry = new BasketRegistry('__local__');
      registry.getBasket(basketMock);
      expect(Array.from(registry.baskets.keys())).toEqual([
        'basket-key@__local__',
      ]);
    });

    it('should suffix with __global__ for unscoped baskets without a defaultScope ctor arg', () => {
      const registry = new BasketRegistry();
      registry.getBasket(basketMock);
      expect(Array.from(registry.baskets.keys())).toEqual([
        'basket-key@__global__',
      ]);
    });

    it('should suffix wtih scopeId for scoped baskets', () => {
      const registry = new BasketRegistry();
      registry.getBasket(basketMock, 's1');
      expect(Array.from(registry.baskets.keys())).toEqual(['basket-key@s1']);
    });
  });
});
