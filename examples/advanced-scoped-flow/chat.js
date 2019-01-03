// @flow
import React, { Component } from 'react';

import { FormSubscriber, FormContainer } from './baskets/form';
import { MessagesSubscriber } from './baskets/messages';
import { ThemeContainer, ThemeSubscriber } from './baskets/theme';

export default class Chat extends Component<{ id: string }> {
  render() {
    return (
      <ThemeContainer scope={this.props.id}>
        <ThemeSubscriber>
          {({ color, change }) => (
            <div style={{ background: color }}>
              <h2>Chat</h2>
              <button onClick={() => change('#DFF')}>Theme 1</button>
              <button onClick={() => change('#FDF')}>Theme 2</button>
              <button onClick={() => change('#FFD')}>Theme 3</button>
              <MessagesSubscriber>
                {({ data, add }) => (
                  <div>
                    <ul>
                      {data.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                    <FormContainer>
                      <FormSubscriber>
                        {({ isValid, message, isSending, input, send }) => (
                          <form
                            action="#"
                            onSubmit={ev => {
                              ev.preventDefault();
                              send(message).then(() => add(message));
                            }}
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
                      </FormSubscriber>
                    </FormContainer>
                  </div>
                )}
              </MessagesSubscriber>
            </div>
          )}
        </ThemeSubscriber>
      </ThemeContainer>
    );
  }
}
