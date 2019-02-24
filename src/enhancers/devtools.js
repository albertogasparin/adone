import defaults from '../defaults';

const connectDevTools = storeState => {
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: `Store ${storeState.key}`,
  });
  devTools.init(storeState.getState());
  devTools.subscribe(message => {
    if (message.type === 'DISPATCH' && message.state) {
      storeState.setState(JSON.parse(message.state));
    }
  });
  return devTools;
};

const withDevtools = createStoreState => (...args) => {
  const storeState = createStoreState(...args);

  if (defaults.devtools && window && window.__REDUX_DEVTOOLS_EXTENSION__) {
    const origMutator = storeState.mutator;
    let devTools;
    const devtoolMutator = arg => {
      const result = origMutator(arg);
      try {
        if (!devTools) {
          devTools = connectDevTools(storeState);
        }
        devTools.send(
          { type: storeState.mutator._action, payload: arg },
          storeState.getState(),
          {},
          storeState.key
        );
      } catch (err) {
        /* ignore devtools errors */
      }
      return result;
    };
    storeState.mutator = devtoolMutator;
  }

  return storeState;
};

export default withDevtools;
