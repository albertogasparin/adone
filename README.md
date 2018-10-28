# React Adone

[![npm](https://img.shields.io/npm/v/react-adone.svg)](https://www.npmjs.com/package/react-adone)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react-adone.svg)](https://bundlephobia.com/result?p=react-adone)
[![License](https://img.shields.io/:license-MIT-blue.svg)](http://albertogasparin.mit-license.org)
[![CircleCI](https://circleci.com/gh/albertogasparin/react-adone.svg?style=shield&circle-token=17a5f372d198e27098226779bc1afd8fd6a2fb3a)](https://circleci.com/gh/albertogasparin/react-adone)
[![codecov](https://codecov.io/gh/albertogasparin/react-adone/branch/master/graph/badge.svg)](https://codecov.io/gh/albertogasparin/react-adone)

Yes, this is another Redux-like/Context-alternative solution. Probably you should use more well known libs unless:

- You don't want to create hundreds of Contexts to share pieces of state
- You have a huge app and a single Redux store is not possible
- You have high performance requirements (Adone uses some tricks to avoid duplicate renders and uses Context API only to get the baskets registry because [it's faster](https://github.com/facebook/react/issues/13739))
- You need your app working even without the Provider
- You care about dev experience (support for Redux Devtools, better testability, flow typings)

## Philosophy

Adone is heavily inspired by Redux, the main difference is the lack of reducers. Store name, actions, default state and selectors are combined in a single entity called Basket. `Yield` is the React component that "yields" from a Basket and returns it's store state (or part of it) and the actions already bound to it.

`Yield` is responsible to get the instantiated basket store (using the `key` attribute) or creating a new one. That makes sharing baskets across you project extremely easy.

Similar to Redux thunk, actions receive a `produce` function (read dispatcher) that gets called with mutator that receives a draft state that can either be modified directly or replaced by returning a new one.

## Basic usage

#### Defining a basket and using `Yield` consumer and provider

```js
// baskets/counter.js
const defaultState = {
  count: 0,
};

const actions = {
  increment: () => produce => {
    // produce() calls immer after passing through middlewares
    // the mutation function should return undefined or the entire new state
    produce(draft => {
      draft.count += 1;
    });
  },
};

export default { key: 'counter', defaultState, actions };
```

```js
// app.js
import { YieldProvider, Yield } from 'react-adone';
import counterBasket from './baskets/counter';

const App = () => (
  {/* Provider is optional. If omitted baskets will be registered to `defaultRegistry` */}
  <YieldProvider>
    <h1>My counter</h1>
    <Yield from={counterBasket}>
      {/* The basket actions and store state get spread for easy consumption */}
      {({ count, increment }) => (
        <div>
          {count}
          <button onClick={increment}>+</button>
        </div>
      )}
    </Yield>
  </YieldProvider>
);
```

For more details about `produce` works, please refer to [immer documentation](https://github.com/mweststrate/immer)

## Running examples

I provided few examples to see Adone in action. Run `npm run start` and then go and check each folder:

- Basic example with Flow typing `http://localhost:8080/basic-flow/`
- Advanced async example with Flow typing `http://localhost:8080/advanced-flow/`

## Advanced usage

#### Basket async actions and extra arguments

Like [redux-thunk](https://github.com/reduxjs/redux-thunk), basket actions can be async and they receive 3 arguments: `produce`, `getState` and an optional, configurable 3rd argument.

```js
// baskets/todo.js
const defaultState = {
  data: null,
  loading: false,
};

const actions = {
  // the mutator function (passed to produce) cannot be async
  // but the thunk returned by the action can
  load: () => async (produce, getState, { api }) => {
    if (getState().loading === true) return;
    produce(function setLoading(draft) {
      draft.loading = true;
    });

    const todos = await api.get('/todos');
    produce(function setData(draft) {
      draft.loading = false;
      draft.data = todos;
    });
  },
};

export default { key: 'todo', defaultState, actions };
```

```js
// app.js
import { YieldProvider, Yield } from 'react-adone';
import todoBasket from './baskets/todo';
import axios from 'axios';

const App = () => (
  <YieldProvider actionExtraArgument={{ api: axios }}>
    <Yield from={todoBasket}>
      {({ load }) => <TriggerComponent onMount={load} />}
    </Yield>
  </YieldProvider>
);

// if you are not using the provider, you can set the 3rd argument
// by importing `defaultRegistry` and calling
// defaultRegistry.setActionExtraArgument({ api: axios })
```

#### Basket scopes

By default all basket instances are stored in the global registry. However in large, complex applications you might want to have multiple instances of the same basket. That's where `YieldScope` component comes into play.
It allows you to have multiple global instances of the same basket type in the registry (still available app-wide and SSR-compatible) or even a local only instance, only accessible to `YieldScope` children.

```js
const App = () => (
  <YieldProvider>
    <YieldScope for={counterBasket} id={'counter-1'}>
      <Yield from={counterBasket}>{({ count }) => count /* this is 1 */}</Yield>
    </YieldScope>

    <YieldScope for={counterBasket} local>
      <Yield from={counterBasket}>
        {/* this instance cannot be accessed elsewhere */}
        {({ count }) => count /* this is 20 */}
      </Yield>
    </YieldScope>

    {/* but somewhere else in the app... */}
    <YieldScope for={counterBasket} id={'counter-1'}>
      <Yield from={counterBasket}>
        {({ count }) => count /* this is 1 as above :) */}
      </Yield>
    </YieldScope>
  </YieldProvider>
);
```

Look at `./examples` folder for more use cases.

#### Basket state rehydration (eg from SSR)

If you server side render your content, you might want to rehydrate your baskets state with the correct data.
`YieldProvider` (and `fallbackProviderState`) supports `initialStates` prop where you can define baskets initial status by key.

```js
// app.js
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

## Optimisation patterns

#### Basket selectors

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

#### Named components

Adone exports an helper function to create yielded components from a specific basket
so you don't have to specify a basket and a pick function

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

#### Composition

Adone supports render props composition via 3rd party libs:

```js
import Composer from "react-composer";
// ...

const UserProject = () => (
  <Composer
    components={[
      <Yield from={userBasket} />,
      <Yield from={projectBasket} />
    ]}
  >
    {([user, project]) => (
      /* here you can have a component that triggers user.load()
         and when user data is returned calls project.load(user.data.id) */
    )}
  </Composer>
);
```

## Configuration

#### Middlewares

Adone supports Redux-like middlewares. They can be added via `defaults.middlewares`.

```js
import { defaults } from 'react-adone';

const logger = store => next => fn => {
  console.log('Updating', store.key);
  const result = next(fn);
  console.log('Changed', result.changes);
  return result;
};

defaults.middlewares.add(logger);
```

#### Devtools

If you have [Redux Devtools extension](https://github.com/zalmoxisus/redux-devtools-extension) installed, Adone action's mutators and state will be visible there.
If you use arrow functions as mutators, the devtools will show just the action name, but if you use named functions you will get also the mutator's name (really handy when an action produces multiple mutations):

```js
const actions = {
  increment: () => produce => {
    // this will be logged as "increment"
    produce(draft => {
      draft.count += 1;
    });
    // this will be logged as "increment.addOne"
    produce(function addOne(draft) {
      draft.count += 1;
    });
  },
};
```

If you want to turn devtools off (for instance on prod), just set the `defaults.devtools` to `false`:

```js
import { defaults } from 'react-adone';
defaults.devtools = false;
```

## Contributing

To test your changes you can run the examples (with `npm run start`).
Also, make sure you run `npm run preversion` before creating you PR so you will double check that linting, types and tests are fine.

## Thanks

This library merges ideas from redux, react-redux, redux-thunk, react-copy-write, bey, react-apollo just to name a few.
Moreover it has been the result of months of discussions with [ferborva](https://github.com/ferborva), [pksjce](https://github.com/pksjce), [TimeRaider](https://github.com/TimeRaider), [dpisani](https://github.com/dpisani), [JedWatson](https://github.com/JedWatson), and other devs at [Atlassian](https://github.com/atlassian).
