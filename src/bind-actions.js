export default function bindActions(
  actions,
  store,
  getContainerProps = () => ({})
) {
  return Object.keys(actions).reduce((acc, k) => {
    acc[k] = (...args) => {
      // Setting mutator name so we can log action name for better debuggability
      const namedMutator = arg => {
        store.mutator._action = k;
        return store.mutator(arg);
      };
      return actions[k](...args)(
        namedMutator,
        store.getState,
        getContainerProps()
      );
    };

    return acc;
  }, {});
}
