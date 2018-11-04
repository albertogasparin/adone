## Basket actions

In order to modify data in a basket you can define actions.

```js
const actions = {
  doSomething: (...args) => (produce, getState, extraArgument) => {
    // your code here
  },
};
```

Actions are function that return another function. This "inner function" (called thunk) will be called by Adone with three arguments:

##### - `produce`

It is the method responsible for triggering actual updates to the store. It is an enhanced version of `immer`, and you call it providing a function that takes the current state as argument and modifies it (or returns a new one).

```js
// inside your action
produce(function changeState(state) {
  state.count += 1;
});
```

For more details about `produce` works, please refer to [immer documentation](https://github.com/mweststrate/immer).
_Side note: If you use a named function, Adone devtools connector will pick it up and show it in the logs_

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

Like [redux-thunk](https://github.com/reduxjs/redux-thunk), basket actions can be async. The mutator function (passed to produce) cannot be async but the thunk returned by the action can

```js
const actions = {
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
```
