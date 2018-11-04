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
