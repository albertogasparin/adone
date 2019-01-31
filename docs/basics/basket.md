## Adone baskets

Baskets are one of the main concepts of Adone. They are an object with 3 keys: `key`, `initialState` and `actions`.

```js
// baskets/counter.js

const key = 'counter';

const initialState = {
  count: 0,
};

const actions = {
  increment: () => setState => {
    // action code...
  },
};

export default { key, initialState, actions };
```

Once used on a view through `<Yield />`, a basket "instance" is created and the state is now shared across all components thanks to the basket `key` string (so the `key` should be unique across your app). In case you need multiple instances of the same basket, the best way is to use `<YieldScope />` which enables the co-existence of multiple global (or local) instances of the same basket ([see YieldScope docs for more](../advanced/yield-scope.md)).
