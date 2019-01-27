// @flow

import { createComponents, type BasketAction } from 'react-adone';

type State = {
  color: string,
};

const defaultState: State = {
  color: '',
};

const actions = {
  change: (value: string): BasketAction<State> => setState => {
    setState({
      color: value,
    });
  },
};

const {
  Subscriber: ThemeSubscriber,
  Container: ThemeContainer,
} = createComponents<State, typeof actions>({
  name: 'theme',
  defaultState,
  actions,
  onContainerInit: (state, variables) => {
    // this gets currently called also when component remount
    // so we have to check state status and apply default only on first mount
    return { ...state, color: state.color || variables.defaultColor };
  },
});

export { ThemeSubscriber, ThemeContainer };
