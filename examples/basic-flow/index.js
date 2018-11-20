// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { YieldProvider } from 'react-adone';

import { CountYield } from './basket';

/**
 * Main App
 */
class App extends Component<{}> {
  render() {
    return (
      <YieldProvider>
        <h1>Counter example</h1>
        <main>
          <CountYield>
            {({ count, increment }) => (
              <div>
                <p>{count}</p>
                <button onClick={increment}>+1</button>
              </div>
            )}
          </CountYield>
        </main>
      </YieldProvider>
    );
  }
}

// $FlowFixMe
ReactDOM.render(<App />, document.getElementById('root'));
