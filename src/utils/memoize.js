// Mostly copied from https://github.com/alexreardon/memoize-one

import shallowEqual from './shallow-equal';

// Shallow comparing arguments, so if arg objects instances are different
// but contents are the same we still get the momoized value
const argumentsEqual = (newArgs, lastArgs) =>
  newArgs.length === lastArgs.length &&
  newArgs.every((newArg, index) => shallowEqual(newArg, lastArgs[index]));

export default function(resultFn) {
  let lastArgs = [];
  let lastResult;
  let calledOnce = false;

  const result = function(...newArgs) {
    if (calledOnce && argumentsEqual(newArgs, lastArgs)) {
      return lastResult;
    }

    lastResult = resultFn.apply(this, newArgs);
    calledOnce = true;
    lastArgs = newArgs;
    return lastResult;
  };

  return result;
}
