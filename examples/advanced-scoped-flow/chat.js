// @flow
import React, { Component } from 'react';

import { FormYield, FormScope } from './baskets/form';
import { MessagesYield } from './baskets/messages';
import { ThemeScope, ThemeYield } from './baskets/theme';

export default class Chat extends Component<{ id: string }> {
  render() {
    return (
      <ThemeScope scope={this.props.id}>
        <ThemeYield>
          {({ color, change }) => (
            <div style={{ background: color }}>
              <h2>Chat</h2>
              <button onClick={() => change('#DFF')}>Theme 1</button>
              <button onClick={() => change('#FDF')}>Theme 2</button>
              <button onClick={() => change('#FFD')}>Theme 3</button>
              <MessagesYield>
                {({ data, add }) => (
                  <div>
                    <ul>
                      {data.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                    <FormScope>
                      <FormYield>
                        {({ isValid, message, isSending, input, send }) => (
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
                      </FormYield>
                    </FormScope>
                  </div>
                )}
              </MessagesYield>
            </div>
          )}
        </ThemeYield>
      </ThemeScope>
    );
  }
}
