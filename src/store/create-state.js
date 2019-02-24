import applyMiddleware from '../middlewares';
import withDevtools from '../enhancers/devtools';
import defaults from '../defaults';

function createStoreState(key, initialState) {
  let listeners = [];
  let currentState = initialState;
  const storeState = {
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
  storeState.mutator = applyMiddleware(storeState, defaults.middlewares);
  return storeState;
}

export default withDevtools(createStoreState);
