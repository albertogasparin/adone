## Adone baskets

Baskets are one of the main concepts of Adone. They are an object with 3 keys: `key`, `defaultState` and `actions`.

```js
// baskets/counter.js

const defaultState = {
  count: 0,
};

const actions = {
  increment: () => produce => {
    // action code...
  },
};

export default { key: 'counter', defaultState, actions };
```

Once used on `<Yield />` a basket "instance" is created and the state is now shared across all components accessing the same basket key (unless you use `<YieldScope />`).
