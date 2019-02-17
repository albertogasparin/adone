// @flow

import { createComponents, type BasketAction } from 'react-adone';

type State = {
  color: string,
};

type ContainerProps = {
  defaultColor: string,
};

const initialState: State = {
  color: '',
};

const actions = {
  change: (value?: string): BasketAction<State> => (
    { setState },
    { defaultColor }
  ) => {
    setState({
      color: value || defaultColor,
    });
  },
};

const {
  Subscriber: ThemeSubscriber,
  Container: ThemeContainer,
} = createComponents<State, typeof actions, ContainerProps>({
  name: 'theme',
  initialState,
  actions,
  onContainerInit: () => ({ getState, actions: boundActions }) => {
    // this gets currently called also when component remounts
    // so it is important to check state status and apply default only on first mount
    const { color } = getState();
    if (!color) {
      boundActions.change();
    }
  },
});

export { ThemeSubscriber, ThemeContainer };
