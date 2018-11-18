## Basket actions

In order to modify data in a basket you can define actions.

```js
const actions = {
  doSomething: (...args) => (setState, getState, extraArgument) => {
    // your code here
  },
};
```

Actions are function that return another function. This "inner function" (called thunk) will be called by Adone with three arguments:

##### - mutator (the default is `setState`)

It is the method responsible for triggering actual updates to the store. The default is a syncronous version of React `setState`, supporting only an object as argument (shallow merged into current state). See React guidelines for do's and dont's around setState for more.

```js
// inside your action
setState({ count: 0 });
```

If you want to replace the default implementation with something else, for instance [immer](https://github.com/mweststrate/immer), just override `defaults.mutator` providing your own implementation.

##### - `getState`

This method returns a fresh state every time you call it. You should use it instead of caching the state inside the action, as it might become stale.

```js
// inside your action
if (getState().loading) {
  /* ... */
}
```

##### - `extraArgument`

This is an optional, customisable argument. It can be an object with utilities and global variables you might need. In order to set it you can pass `actionExtraArgument` prop to `YieldProvider` or call `configure()` on `defaultRegistry` if you are using Adone provider-less.

### Basket async actions

Like [redux-thunk](https://github.com/reduxjs/redux-thunk), basket actions can be async and you can call `setState` as many time as you need. Please note that changes to the state are applied immediately, so you should always use `getState` to query for a value. If you cache in a variable the result of `getState` you might accidentally use stale data.

```js
const actions = {
  load: () => async (setState, getState, { api }) => {
    if (getState().loading === true) return;
    setState({
      loading: true,
    });

    const todos = await api.get('/todos');
    setState({
      loading: false,
      data: todos,
    });
  },
};
```
