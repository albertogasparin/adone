import defaults from './defaults';

const createNamedMutator = (store, actionName) =>
  defaults.devtools
    ? arg => {
        store.mutator._action = actionName;
        return store.mutator(arg);
      }
    : store.mutator;

export const bindAction = (
  store,
  actionFn,
  actionKey,
  getContainerProps,
  otherActions
) => {
  // Setting mutator name so we can log action name for better debuggability
  const namedMutator = createNamedMutator(store, actionKey);
  const dispatch = thunkFn =>
    thunkFn(
      {
        setState: namedMutator,
        getState: store.getState,
        actions: otherActions,
        dispatch,
      },
      getContainerProps()
    );
  return (...args) => dispatch(actionFn(...args));
};

export const bindActions = (actions, store, getContainerProps = () => ({})) =>
  Object.keys(actions).reduce((acc, k) => {
    acc[k] = bindAction(store, actions[k], k, getContainerProps, actions);
    return acc;
  }, {});
