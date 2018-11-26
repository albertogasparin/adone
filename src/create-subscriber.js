import Subscriber from './components/subscriber';

export default function createSubscriber(basketType) {
  return class extends Subscriber {
    static basketType = basketType;
    static displayName = `Subscriber(${basketType.key[0]})`;
  };
}
