import defaults from './defaults';

const createNamedMutator = (store, actionName) =>
  defaults.devtools
    ? arg => {
        store.mutator._action = actionName;
        return store.mutator(arg);
      }
    : store.mutator;

export default function bindActions(
  actions,
  store,
  getContainerProps = () => ({})
) {
  return Object.keys(actions).reduce((acc, k) => {
    // Setting mutator name so we can log action name for better debuggability
    const namedMutator = createNamedMutator(store, k);
    acc[k] = (...args) => {
      return actions[k](...args)(
        {
          setState: namedMutator,
          getState: store.getState,
          actions: acc,
        },
        getContainerProps()
      );
    };
    return acc;
  }, {});
}
