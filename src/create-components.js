import createYield from './create-yield';
import createScope from './create-scope';
import hash from './utils/hash';

export default function createComponents({ name = '', defaultState, actions }) {
  const src = !name
    ? Object.keys(actions).reduce((acc, k) => acc + actions[k].toString(), '')
    : '';
  const rawBasket = {
    key: [name, hash(src + JSON.stringify(defaultState))].filter(Boolean),
    defaultState,
    actions,
  };
  return {
    Yield: createYield(rawBasket),
    Scope: createScope(rawBasket),
  };
}
