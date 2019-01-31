import Container from './container';
import Subscriber from './subscriber';
import hash from '../utils/hash';

const createSubscriber = basketType =>
  class extends Subscriber {
    static basketType = basketType;
    static displayName = `Subscriber(${basketType.key[0]})`;
  };

const createContainer = basketType =>
  class extends Container {
    static basketType = basketType;
    static displayName = `Container(${basketType.key[0]})`;
  };

export function createComponents({
  name = '',
  initialState,
  actions,
  onContainerInit = null,
  onContainerUpdate = null,
}) {
  const src = !name
    ? Object.keys(actions).reduce((acc, k) => acc + actions[k].toString(), '')
    : '';
  const rawBasket = {
    key: [name, hash(src + JSON.stringify(initialState))].filter(Boolean),
    initialState,
    actions,
    onContainerInit,
    onContainerUpdate,
  };
  return {
    Container: createContainer(rawBasket),
    Subscriber: createSubscriber(rawBasket),
  };
}

export function createSelector(SubscriberComponent, selectorFn, displayName) {
  return class extends SubscriberComponent {
    static selector = selectorFn;
    static displayName =
      displayName ||
      `SubscriberSelector(${SubscriberComponent.basketType.key[0]})`;
  };
}
