// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { YieldProvider } from 'react-adone';

import Chat from './chat';

/**
 * Main App
 */
class App extends Component<{}, { reset: number, remount: number }> {
  state = {
    reset: 0,
    remount: 0,
  };

  reset = () => {
    const reset = this.state.reset + 2;
    this.setState({ reset });
  };

  remount = () => {
    const remount = this.state.remount + 2;
    this.setState({ remount });
  };

  render() {
    const { reset, remount } = this.state;
    return (
      <YieldProvider>
        <h1>Chat example</h1>
        <button onClick={this.reset}>Reset theme (scope id change)</button>
        <button onClick={this.remount}>Reset form (local scope remount)</button>
        <main>
          <Chat key={String(remount)} id={String(reset)} />
          <Chat key={String(remount + 1)} id={String(reset + 1)} />
        </main>
      </YieldProvider>
    );
  }
}

// $FlowFixMe
ReactDOM.render(<App />, document.getElementById('root'));
