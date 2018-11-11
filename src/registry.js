import bindActions from './bind-actions';
import createStore from './create-store';

export const GLOBAL_SCOPE = '@@GLOBAL';

export default class BasketRegistry {
  baskets = new Map();
  initialStates = {};

  configure({ initialStates = {}, actionExtraArgument = {} }) {
    this.initialStates = initialStates;
    this.actionExtraArgument = actionExtraArgument;
  }

  initBasket = (key, basket) => {
    const { defaultState, actions } = basket;
    const initialState = this.initialStates[key];
    const store = createStore(key, initialState || defaultState);
    const boundActions = bindActions(actions, store, this.actionExtraArgument);
    const basketInstance = { store, actions: boundActions };

    this.baskets.set(key, basketInstance);
    return basketInstance;
  };

  getBasket = (basket, scopeId = GLOBAL_SCOPE) => {
    const key = this.generateKey(basket, scopeId);
    return this.baskets.get(key) || this.initBasket(key, basket);
  };

  deleteBasket = (basket, scopeId = GLOBAL_SCOPE) => {
    const key = this.generateKey(basket, scopeId);
    this.baskets.delete(key);
  };

  generateKey(basket, scopeId) {
    return basket.key + (scopeId === GLOBAL_SCOPE ? '' : `#${scopeId}`);
  }
}

export const defaultRegistry = new BasketRegistry();
