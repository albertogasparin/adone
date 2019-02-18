import ContainerComponent from './container';
import SubscriberComponent from './subscriber';
import hash from '../utils/hash';

const noop = () => () => {};
const defaultSelector = state => state;

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

export function createSubscriber(
  Store,
  { selector = defaultSelector, displayName = '' } = {}
) {
  return class extends SubscriberComponent {
    static basketType = Store;
    static displayName = displayName || `Subscriber(${Store.key[0]})`;
    static selector = selector;
  };
}

export function createContainer(
  Store,
  { onInit = noop, onUpdate = noop, displayName = '' } = {}
) {
  return class extends ContainerComponent {
    static basketType = Store;
    static displayName = displayName || `Container(${Store.key[0]})`;
    static hooks = { onInit, onUpdate };
  };
}
