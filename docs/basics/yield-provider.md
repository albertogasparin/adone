## Provider or provider-less

Compared to other state management libraries, Adone does not require a provider at the top. However, you might still want one if you don't like storing state in a global object.

```js
// app.js
import { YieldProvider } from 'react-adone';
import axios from 'axios';

const App = () => (
  <YieldProvider
    initialStates={{ counter: { count: 10 } }}
    actionExtraArgument={{ api: axios }}
  >
    {/* your app */}
  </YieldProvider>
);
```

The same configuration passed to the `YieldProvider` is available for the default basket registry, via the `config` method

```js
import { defaultRegistry } from 'react-adone';
import axios from 'axios';

defaultRegistry.config({
  initialStates: { counter: { count: 10 } },
  actionExtraArgument: { api: axios },
});

const App = () => (
  /* your app */
);
```
