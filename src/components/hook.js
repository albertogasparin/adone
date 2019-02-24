import { useState, useEffect, useRef, useCallback } from 'react';
import { readContext } from '../context';
import memoize from '../utils/memoize';

const EMPTY_STATE = {};

export function createHook(Store, selector = state => state) {
  return function(props) {
    // instead of using "useContext" we get the context value with
    // a custom implementation so our components do not render on ctx change
    const ctx = readContext();
    const { storeState, actions } = ctx.getStore(Store);

    // If selector is not null, create a ref to the memoized version of it
    // Otherwise always return same value, as we ignore state
    const stateSelector = selector
      ? useCallback(memoize(selector), [])
      : () => EMPTY_STATE;

    const currentState = stateSelector(storeState.getState(), props);
    let [prevState, setState] = useState(currentState);

    // We store update function into a ref so when called has fresh state
    // React setState in useEffect provides a stale state unless we re-subscribe
    // https://github.com/facebook/react/issues/14042
    const onUpdateRef = useRef();
    onUpdateRef.current = updState => {
      const nextState = stateSelector(updState, props);
      if (nextState !== currentState) {
        setState(nextState);
      }
    };

    // if we detect that state has changed, we shedule an immediate re-render
    // (as suggested by react docs https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops)
    // still, it feels silly
    if (prevState !== currentState) {
      setState(currentState);
    }

    useEffect(() => {
      // we call the current ref fn so state is fresh
      const onUpdate = updState => onUpdateRef.current(updState);
      // after component is mounted or store changed, we subscribe
      const unsubscribe = storeState.subscribe(onUpdate);
      return () => {
        // fired on unmount or every time store changes
        unsubscribe();
      };
    }, [storeState]);

    return [currentState, actions];
  };
}
