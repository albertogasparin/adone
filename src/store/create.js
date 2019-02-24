import hash from '../utils/hash';

export function createStore({ name = '', initialState, actions }) {
  const src = !name
    ? Object.keys(actions).reduce((acc, k) => acc + actions[k].toString(), '')
    : '';
  return {
    key: [name, hash(src + JSON.stringify(initialState))].filter(Boolean),
    initialState,
    actions,
  };
}
