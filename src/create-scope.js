import Scope from './components/scope';

export default function createScope(basketType) {
  return class extends Scope {
    static basketType = basketType;
    static displayName = `Scope(${basketType.key[0]})`;
  };
}
