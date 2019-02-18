// @flow

import {
  createStore,
  createContainer,
  createSubscriber,
  type Action,
} from 'react-adone';

type State = {
  color: string,
};

type Actions = typeof actions;

type ContainerProps = {|
  defaultColor: string,
|};

const initialState: State = {
  color: '',
};

const actions = {
  change: (value?: string): Action<State> => (
    { setState },
    { defaultColor }
  ) => {
    setState({
      color: value || defaultColor,
    });
  },
};

const Store = createStore<State, Actions>({
  name: 'theme',
  initialState,
  actions,
});

export const ThemeContainer = createContainer<*, *, ContainerProps>(Store, {
  onInit: () => ({ getState, actions: boundActions }) => {
    // this gets currently called also when component remounts
    // so it is important to check state status and apply default only on first mount
    const { color } = getState();
    if (!color) {
      boundActions.change();
    }
  },
});

export const ThemeSubscriber = createSubscriber<*, *>(Store);
