import applyMiddleware from './middlewares';
import withDevtools from './enhancers/devtools';
import defaults from './defaults';

function createStore(key, initialState) {
  let listeners = [];
  let currentState = initialState;
  const store = {
    key,
    getState() {
      return currentState;
    },
    setState(nextState) {
      currentState = nextState;
      for (let i = 0, l = listeners.length; i < l; i++) {
        listeners[i](currentState);
      }
    },
    subscribe(listener) {
      listeners.push(listener);
      return function unsubscribe() {
        listeners = listeners.filter(fn => fn !== listener);
      };
    },
    listeners() {
      return listeners;
    },
  };
  store.mutator = applyMiddleware(store, defaults.middlewares);
  return store;
}

export default withDevtools(createStore);
