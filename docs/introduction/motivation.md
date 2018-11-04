## Motivation

State management in React is a complex problem. The de-facto standard is Redux, however new patterns are emerging and they require a flexible solutions. React itself is providing more and more primitives to try help people addressing this problem, reducing the complexity that some solutions require, but complex applications require more structure than just primitives.

That's why Adone tries to get the good parts of Redux, React Context (and probably React Hooks in the near future), combine them in a nice package easy to use and scale.

Redux, the good parts:

- Actions
- Devtools (and dev experience in general)
- Middlewares
- Selectors

Context, the good parts:

- Lack of pre-determined boundaries
- Provider-less option
- Render props explicitness
