// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { defaults, type Middleware } from 'react-adone';

import { UserListRpc, UserListHook } from './components/user-list';
import { TodoListRpc, TodoListHook } from './components/todo-list';

/**
 * Add simple logger middleware
 */
const mw: Middleware = store => next => arg => {
  /* eslint-disable no-console */
  console.log(store.key, 'changing', arg);
  const result = next(arg);
  console.log(store.key, 'changed');
  return result;
};
defaults.middlewares.add(mw);
/**
 * Enable Redux devtools support
 */
defaults.devtools = true;

/**
 * Main App
 */
class App extends Component<{}> {
  render() {
    return (
      <div>
        <h1>User Todos example</h1>
        <main>
          <div>
            <h3>With Render-props</h3>
            <UserListRpc />
            <TodoListRpc />
          </div>
          <hr />
          <div>
            <h3>With Hooks</h3>
            <UserListHook />
            <TodoListHook />
          </div>
        </main>
      </div>
    );
  }
}

// $FlowFixMe
ReactDOM.render(<App />, document.getElementById('root'));
