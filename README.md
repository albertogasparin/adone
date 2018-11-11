# React Adone

[![npm](https://img.shields.io/npm/v/react-adone.svg)](https://www.npmjs.com/package/react-adone)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react-adone.svg)](https://bundlephobia.com/result?p=react-adone)
[![License](https://img.shields.io/:license-MIT-blue.svg)](http://albertogasparin.mit-license.org)
[![CircleCI](https://circleci.com/gh/albertogasparin/react-adone.svg?style=shield&circle-token=17a5f372d198e27098226779bc1afd8fd6a2fb3a)](https://circleci.com/gh/albertogasparin/react-adone)
[![codecov](https://codecov.io/gh/albertogasparin/react-adone/branch/master/graph/badge.svg)](https://codecov.io/gh/albertogasparin/react-adone)

Taking the good parts of Redux and React Context to build a flexible, scalable and easy to use state management solution.

## Philosophy

Adone is heavily inspired by Redux, the main difference is the lack of reducers. Store name, actions, default state and selectors are combined in a single entity called Basket. `Yield` is the React component that "yields" from a Basket and returns it's store state (or part of it) and the actions already bound to it.

`Yield` is responsible to get the instantiated basket store (using the `key` attribute) or creating a new one. That makes sharing baskets across you project extremely easy.

Similar to Redux thunk, actions receive a `produce` function (read dispatcher) that gets called with mutator that receives a draft state that can either be modified directly or replaced by returning a new one.

## Basic usage

```sh
npm i react-adone
# or
yarn add react-adone
```

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

## Documentation

[Visit the documentation website](https://albertogasparin.github.io/react-adone/) or [check the docs folder](docs/README.md).

## Examples

See Adone in action: run `npm run start` and then go and check each folder:

- Basic example with Flow typing `http://localhost:8080/basic-flow/`
- Advanced async example with Flow typing `http://localhost:8080/advanced-flow/`
- Advanced scoped example with Flow typing `http://localhost:8080/advanced-scoped-flow/`

## Contributing

To test your changes you can run the examples (with `npm run start`).
Also, make sure you run `npm run preversion` before creating you PR so you will double check that linting, types and tests are fine.

## Thanks

This library merges ideas from redux, react-redux, redux-thunk, react-copy-write, bey, react-apollo just to name a few.
Moreover it has been the result of months of discussions with [ferborva](https://github.com/ferborva), [pksjce](https://github.com/pksjce), [TimeRaider](https://github.com/TimeRaider), [dpisani](https://github.com/dpisani), [JedWatson](https://github.com/JedWatson), and other devs at [Atlassian](https://github.com/atlassian).
