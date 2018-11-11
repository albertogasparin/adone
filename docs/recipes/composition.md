## Composition

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
