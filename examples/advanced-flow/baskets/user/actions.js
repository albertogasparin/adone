// @flow
import { type BasketAction } from 'react-adone';
import type { UserModel, State } from './types';

// Dummy data
const USERS: UserModel[] = [
  { id: '1', name: 'Bob' },
  { id: '2', name: 'Paul' },
];

export const load = (): BasketAction<State> => async ({
  setState,
  getState,
}) => {
  if (getState().loading) return;
  setState({
    loading: true,
  });
  // simulate async call
  await new Promise(r => setTimeout(r, 1000));
  setState({
    loading: false,
    data: USERS,
  });
};

export const select = (uid: string): BasketAction<State> => ({ setState }) => {
  setState({
    selected: uid,
  });
};
