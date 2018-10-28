import React from 'react';

import { defaultRegistry } from './registry';

const { Provider, Consumer } = React.createContext({
  globalRegistry: defaultRegistry,
  getBasket: defaultRegistry.getBasket,
});

// Reading context value from owner as suggested by gaearon
// https://github.com/facebook/react/pull/13861#issuecomment-430356644
// plus a fix to make it work with enzyme shallow
const readContext = () => {
  const {
    ReactCurrentOwner: { currentDispatcher },
  } = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  return currentDispatcher
    ? currentDispatcher.readContext(Consumer)
    : Consumer._currentValue;
};

export { Provider, Consumer, readContext };
