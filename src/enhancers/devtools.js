import defaults from '../defaults';

const connectDevTools = store => {
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: `Basket ${store.key}`,
  });
  devTools.init(store.getState());
  devTools.subscribe(message => {
    if (message.type === 'DISPATCH') {
      store.setState(JSON.parse(message.state));
    }
  });
  return devTools;
};

const withDevtools = createStore => (...args) => {
  const store = createStore(...args);

  if (defaults.devtools && window && window.__REDUX_DEVTOOLS_EXTENSION__) {
    const origMutator = store.mutator;
    let devTools;
    const devtoolMutator = arg => {
      const result = origMutator(arg);
      try {
        if (!devTools) {
          devTools = connectDevTools(store);
        }
        devTools.send(store.mutator._action, store.getState(), {}, store.key);
      } catch (err) {
        /* ignore devtools errors */
      }
      return result;
    };
    store.mutator = devtoolMutator;
  }

  return store;
};

export default withDevtools;
