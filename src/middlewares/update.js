const updateMiddleware = store => next => arg => {
  let output;
  const state = store.getState();
  const nextState = next(state, arg, out => {
    output = out;
  });
  if (nextState !== state) {
    store.setState(nextState);
  }
  return output;
};

export default updateMiddleware;
