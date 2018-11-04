## Named `Yield` components

Adone exports an helper function to create yielded components from a specific basket so you don't have to specify a basket and a pick function every single time

```js
// todo-components.js
import { createYield } from 'react-adone';
import todoBasket, { selectors } from './baskets/todo';

export const TodoYield = createYield('TodoYield', todoBasket);
export const TodosCountYield = createYield(
  'TodosCountYield',
  todoBasket,
  selectors.getTodosCount
);

// and they can be used as:
// <TodoYield>{({ ... }) => ... }<TodoYield>
// <TodosCountYield>{({ ... }) => ... }<TodosCountYield>
```
