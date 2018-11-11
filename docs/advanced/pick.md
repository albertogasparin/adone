## Picking values of a basket (aka basket selectors)

`Yield` `pick` prop allows you to provide a selector, making the render prop function get called only when the returned value of the selector changes.

```js
// baskets/todo.js
// ...
export const selectors = {
  getTodosCount: state => ({ todosCount: state.todos.length }),
};
```

```js
// todos-count.js
import { Yield } from 'react-adone';
import todoBasket, { selectors } from './baskets/todo';

export const TodosCount = () => (
  <Yield from={todoBasket} pick={selectors.getTodosCount}>
    {/* render prop is called only on todosCount change */}
    {({ todosCount }) => <p>You have {todosCount} todos</p>}
  </Yield>
);
```

If you want to pass props to the selector, you can set `withProps` prop on `Yield` and that object will be the second argument of the selector:

```js
// button-increment.js
import { Yield } from 'react-adone';
import todoBasket, { selectors } from './baskets/todo';

export const TodoList = ({ status }) => (
  <Yield from={todoBasket} pick={selectors.filterByStatus} withProps={{ status: 'todo' }}>
    {({ todos }) => /* render... */}
  </Yield>
);
```

A useful value of `pick` is `null`: when so, `Yield` children will not re-render on store state change
(but will if parent re-renders, as Adone is **not** using `PureComponent` nor `shouldComponentUpdate`).
`null` is useful when children just have to trigger actions on the basket:

```js
// button-increment.js
import { Yield } from 'react-adone';
import counterBasket from './baskets/counter';

export const ButtonIncrement = () => (
  <Yield from={counterBasket} pick={null}>
    {({ actions }) => <button onClick={actions.increment}>+</button>}
  </Yield>
);
```
