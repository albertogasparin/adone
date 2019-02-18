// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { CountSubscriber } from './basket';

/**
 * Main App
 */
class App extends Component<{}> {
  render() {
    return (
      <div>
        <h1>Counter example</h1>
        <main>
          <CountSubscriber>
            {({ count }, { increment }) => (
              <div>
                <p>{count}</p>
                <button onClick={increment}>+1</button>
              </div>
            )}
          </CountSubscriber>
        </main>
      </div>
    );
  }
}

// $FlowFixMe
ReactDOM.render(<App />, document.getElementById('root'));
