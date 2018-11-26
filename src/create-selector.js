export default function createSelector(Subscriber, selectorFn, displayName) {
  return class extends Subscriber {
    static selector = selectorFn;
    static displayName =
      displayName || `SubscriberSelector(${Subscriber.basketType.key[0]})`;
  };
}
