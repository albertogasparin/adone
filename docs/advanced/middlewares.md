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
