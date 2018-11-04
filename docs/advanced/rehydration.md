#### Basket state rehydration (eg from SSR)

If you server side render your content, you might want to rehydrate your baskets state with the correct data.
`YieldProvider` (and `defaultRegistry`) supports `initialStates` prop where you can define baskets initial status by key.

If you are going provider-less:

```js
import { defaultRegistry, Yield } from 'react-adone';
import counterBasket from './baskets/counter';

defaultRegistry.configure({
  initialStates: { counter: { count: 10 } },
});

const App = () => (
  <div>
    <Yield from={counterBasket}>
      {({ count }) => (
        <p>{count}</p>
        {/* Count will now be 10 instead of the default 0 */}
      )}
    </Yield>
  </div>
);
```

Otherwise with `YieldProvider`:

```js
import { YieldProvider, Yield } from 'react-adone';
import counterBasket from './baskets/counter';

const initialStates = { counter: { count: 10 } };

const App = () => (
  <YieldProvider initialStates={initialStates}>
    <Yield from={counterBasket}>
      {({ count }) => (
        <p>{count}</p>
        {/* Count will now be 10 instead of the default 0 */}
      )}
    </Yield>
  </YieldProvider>
);
```
