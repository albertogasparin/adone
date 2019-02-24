import defaults from '../defaults';

const createNamedMutator = (storeState, actionName) =>
  defaults.devtools
    ? arg => {
        storeState.mutator._action = actionName;
        return storeState.mutator(arg);
      }
    : storeState.mutator;

export const bindAction = (
  storeState,
  actionFn,
  actionKey,
  getContainerProps,
  otherActions
) => {
  // Setting mutator name so we can log action name for better debuggability
  const namedMutator = createNamedMutator(storeState, actionKey);
  const dispatch = thunkFn =>
    thunkFn(
      {
        setState: namedMutator,
        getState: storeState.getState,
        actions: otherActions,
        dispatch,
      },
      getContainerProps()
    );
  return (...args) => dispatch(actionFn(...args));
};

export const bindActions = (
  actions,
  storeState,
  getContainerProps = () => ({})
) =>
  Object.keys(actions).reduce((acc, k) => {
    acc[k] = bindAction(storeState, actions[k], k, getContainerProps, actions);
    return acc;
  }, {});
