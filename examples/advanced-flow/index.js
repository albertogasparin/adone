// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { AdoneProvider, defaults, type Middleware } from 'react-adone';

import UserList from './components/user-list';
import TodoList from './components/todo-list';

/**
 * Add simple logger middleware
 */
const mw: Middleware = store => next => fn => {
  const result = next(fn);
  console.log('Changed on', store.key); // eslint-disable-line no-console
  return result;
};
defaults.middlewares.add(mw);

/**
 * Main App
 */
class App extends Component<{}> {
  render() {
    return (
      <AdoneProvider>
        <h1>User Todos example</h1>
        <main>
          <UserList />
          <TodoList />
        </main>
      </AdoneProvider>
    );
  }
}

// $FlowFixMe
ReactDOM.render(<App />, document.getElementById('root'));
