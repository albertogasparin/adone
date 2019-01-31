import bindActions from './bind-actions';
import createStore from './create-store';

export const GLOBAL_SCOPE = '__global__';

export default class BasketRegistry {
  baskets = new Map();
  initialStates = {};

  constructor(defaultScope = GLOBAL_SCOPE) {
    this.defaultScope = defaultScope;
  }

  configure = ({ initialStates = {}, actionExtraArgument = {} }) => {
    this.initialStates = initialStates;
    this.actionExtraArgument = actionExtraArgument;
  };

  initBasket = (key, basket) => {
    const { initialState, actions } = basket;
    const injectedState = this.initialStates[key];
    const store = createStore(key, injectedState || initialState);
    const boundActions = bindActions(actions, store, this.actionExtraArgument);
    const basketInstance = { store, actions: boundActions };

    this.baskets.set(key, basketInstance);
    return basketInstance;
  };

  getBasket = (basket, scopeId = this.defaultScope) => {
    const key = this.generateKey(basket, scopeId);
    return this.baskets.get(key) || this.initBasket(key, basket);
  };

  deleteBasket = (basket, scopeId = this.defaultScope) => {
    const key = this.generateKey(basket, scopeId);
    this.baskets.delete(key);
  };

  generateKey = (basket, scopeId) => `${basket.key.join('__')}@${scopeId}`;
}

export const defaultRegistry = new BasketRegistry();
