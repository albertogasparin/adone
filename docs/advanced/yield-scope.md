#### Basket scopes with `YieldScope`

By default all basket instances are stored in the global registry. However in large, complex applications you might want to have multiple instances of the same basket. That's where `YieldScope` component comes into play.
It allows you to have multiple global instances of the same basket type in the registry (still available app-wide and SSR-compatible) or even a local only instance, only accessible to `YieldScope` children.

```js
import { YieldScope, Yield } from 'react-adone';
import counterBasket from 'baskets/counter';

const App = () => (
  <Fragment>
    <YieldScope for={counterBasket} id={'counter-1'}>
      <Yield from={counterBasket}>
        {({ count }) => count /* this might be 1 */}
      </Yield>
    </YieldScope>

    <YieldScope for={counterBasket} local>
      <Yield from={counterBasket}>
        {/* this instance cannot be accessed elsewhere */}
        {({ count }) => count /* this might be 20 */}
      </Yield>
    </YieldScope>

    {/* but somewhere else in the app... */}
    <YieldScope for={counterBasket} id={'counter-1'}>
      <Yield from={counterBasket}>
        {({ count }) => count /* this is 1 as above */}
      </Yield>
    </YieldScope>
  </Fragment>
);
```

The power of `YieldScope` is that you can expand or reduce the scope at will, without requiring any change on the children. That means you can start with a localised scope and then if you need to access the same state elsewhere you can just move `YieldScope` up in the tree (or make the scope global providing an `id`).
