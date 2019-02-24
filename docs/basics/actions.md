## Store actions

In order to modify data in a store you can define actions.

```js
const actions = {
  doSomething: (...args) => (
    { setState, getState, actions, dispatch },
    containerProps
  ) => {
    // your code here
  },
};
```

Actions are function that return another function. This "inner function" (called thunk) will be called by Adone with two arguments. The first one is an object with:

##### - setState

It is the method responsible for triggering actual updates to the store. The default is a syncronous version of React `setState`, supporting only an object as argument (shallow merged into current state). See React guidelines for do's and dont's around setState for more around the limitations of shallow merge.

```js
// inside your action
setState({ count: 0 });
```

You can replace this default implementation with a custom one, for instance with [immer](https://github.com/mweststrate/immer), by overriding `defaults.mutator`.

##### - `getState`

This method returns a fresh state every time you call it. You should use it instead of caching the state inside the action, as it might become stale.

```js
// inside your action
if (getState().loading) {
  /* ... */
}
```

##### - `actions`

This object contains all the actions you have defined for this store, ready to be called.

##### - `dispatch`

This method allows you to trigger other actions:

```js
// inside your action
dispatch(actions.increment(2));
```

### Async actions

Like [redux-thunk](https://github.com/reduxjs/redux-thunk), store actions can be async and you can call `setState` as many time as you need. Please note that changes to the state are applied immediately, so you should always use `getState` to query for a value. If you cache in a variable the result of `getState` you might accidentally use stale data.

```js
const actions = {
  load: () => async ({ setState, getState }, { api }) => {
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
