# React Adone

[![npm](https://img.shields.io/npm/v/react-adone.svg)](https://www.npmjs.com/package/react-adone)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react-adone.svg)](https://bundlephobia.com/result?p=react-adone)
[![License](https://img.shields.io/:license-MIT-blue.svg)](http://albertogasparin.mit-license.org)
[![CircleCI](https://circleci.com/gh/albertogasparin/react-adone.svg?style=shield&circle-token=17a5f372d198e27098226779bc1afd8fd6a2fb3a)](https://circleci.com/gh/albertogasparin/react-adone)
[![codecov](https://codecov.io/gh/albertogasparin/react-adone/branch/master/graph/badge.svg)](https://codecov.io/gh/albertogasparin/react-adone)

Taking the good parts of Redux and React Context to build a flexible, scalable and easy to use state management solution.

```sh
npm i react-adone
# or
yarn add react-adone
```

```js
import { createStore, createSubscriber } from 'react-adone';

const Store = createStore({
  // value of the store on initialisation
  initialState = {
    count: 0,
  },
  // actions that trigger store mutation
  actions: {
    increment: (by = 1) => ({ setState, getState }) => {
      // mutate state syncronously
      setState({
        count: getState().count + by,
      });
    },
  },
  // optional, mostly used for easy debugging
  name: 'counter',
})

const CounterSubscriber = createSubscriber(Store);

const App = () => (
  <div>
    <h1>My counter</h1>
    <CounterSubscriber>
      {/* Store state is the first argument and actions are the second one */}
      {({ count }, { increment }) => (
        <div>
          {count}
          <button onClick={increment}>Add +1</button>
        </div>
      )}
    </CounterSubscriber>
  </div>
);
```
