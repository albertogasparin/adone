## Provider or provider-less

Compared to other state management libraries, Adone does not require a provider at the top. However, you might still want one if you don't like storing state in a global object.

```js
// app.js
import { YieldProvider } from 'react-adone';

const initialData = { counter: { count: 10 } };

const App = () => (
  <YieldProvider initialStates={initialData}>{/* your app */}</YieldProvider>
);
```

The same configuration passed to the `YieldProvider` is available for the default basket registry, via the `config` method

```js
import { defaultRegistry } from 'react-adone';

const initialData = { counter: { count: 10 } };

defaultRegistry.config({
  initialStates: initialData,
});

const App = () => (
  /* your app */
);
```
