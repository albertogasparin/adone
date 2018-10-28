// @flow
import React, { Component } from 'react';
import { Yield, YieldScope } from 'react-adone';

import formBasket from './baskets/form';
import messagesBasket from './baskets/messages';
import themeBasket from './baskets/theme';

export default class Chat extends Component<{ id: string }> {
  render() {
    return (
      <YieldScope id={this.props.id} for={themeBasket}>
        <Yield from={themeBasket}>
          {// $FlowFixMe actionintersection bug
          ({ color, change }) => (
            <div style={{ background: color }}>
              <h2>Chat</h2>
              <button onClick={() => change('#DFF')}>Theme 1</button>
              <button onClick={() => change('#FDF')}>Theme 2</button>
              <button onClick={() => change('#FFD')}>Theme 3</button>
              <Yield from={messagesBasket}>
                {// $FlowFixMe actionintersection bug
                ({ data, add }) => (
                  <div>
                    <ul>
                      {data.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                    <YieldScope local for={formBasket}>
                      <Yield from={formBasket}>
                        {// $FlowFixMe actionintersection bug
                        ({ isValid, message, isSending, input, send }) => (
                          <form
                            action="#"
                            onSubmit={() =>
                              send(message).then(() => add(message))
                            }
                          >
                            <textarea
                              value={message}
                              disabled={isSending}
                              onChange={ev => input(ev.target.value)}
                            />
                            <button disabled={!isValid || isSending}>
                              {isSending ? '...' : 'Send'}
                            </button>
                          </form>
                        )}
                      </Yield>
                    </YieldScope>
                  </div>
                )}
              </Yield>
            </div>
          )}
        </Yield>
      </YieldScope>
    );
  }
}
