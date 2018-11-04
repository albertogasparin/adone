## Using baskets with `Yield` component

`<Yield />` is the React component that allows you to access basket data and actions in your views. It uses the render prop pattern to expose state and actions.

Given a "counter" basket with `count` state and `increment` action:

```js
// count-component.js
import { Yield } from 'react-adone';
import counterBasket from './baskets/counter';

const MyCounter = () => (
  <Yield from={counterBasket}>
    {/* The basket actions and store state get spread for easy consumption */}
    {({ count, increment }) => (
      <div>
        {count}
        <button onClick={increment}>Add one</button>
      </div>
    )}
  </Yield>
);
```
