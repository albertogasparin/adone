## Using `Subscriber` component

Each `<Subscriber />` allows you to access store data and actions in your views, via render prop pattern.

Given a `CounterSubscriber` with `count` state and `increment` action:

```js
// count-component.js
import { CounterSubscriber } from './components/counter';

const MyCounter = () => (
  <CounterSubscriber>
    {/* Store state is the first argument and actions are the second one */}
    {({ count }, { increment }) => (
      <div>
        {count}
        <button onClick={increment}>Add one</button>
      </div>
    )}
  </CounterSubscriber>
);
```
