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
      listeners.forEach(listener => listener());
    },
    subscribe(listener) {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(fn => fn !== listener);
      };
    },
    listeners() {
      return listeners;
    },
  };
  store.produce = applyMiddleware(store, defaults.middlewares);
  return store;
}

export default withDevtools(createStore);
