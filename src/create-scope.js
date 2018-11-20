import YieldScope from './yield-scope';

export default function createScope(displayName, basket) {
  if (typeof displayName !== 'string') {
    [basket, displayName] = [displayName, ''];
  }
  return class extends YieldScope {
    static defaultProps = {
      ...YieldScope.defaultProps,
      for: basket,
    };
    static displayName = displayName || `YieldScope(${basket.key[0]})`;
  };
}
