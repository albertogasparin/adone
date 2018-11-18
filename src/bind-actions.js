export default function bindActions(actions, store, extraArg) {
  return Object.keys(actions).reduce((acc, k) => {
    // Using a wrapped mutator so we can name fn for better debuggability
    const namedMutator = {
      [k](arg) {
        store.mutator._action = k;
        return store.mutator(arg);
      },
    };
    acc[k] = (...args) =>
      actions[k](...args)(namedMutator[k], store.getState, extraArg);
    return acc;
  }, {});
}
