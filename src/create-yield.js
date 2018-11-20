import Yield from './yield';

export default function createYield(displayName, from, pick) {
  if (typeof displayName !== 'string') {
    [from, pick, displayName] = [displayName, from, ''];
  }
  return class extends Yield {
    static defaultProps = {
      ...Yield.defaultProps,
      from,
      pick,
    };
    static displayName = displayName || `Yield(${from.key[0]})`;
  };
}
