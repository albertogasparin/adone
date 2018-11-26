// @flow

import { createComponents, createSelector } from 'react-adone';
import type { State } from './types';

import * as actions from './actions';
import * as selectors from './selectors';

const defaultState: State = {
  selected: null,
  data: null,
  loading: false,
};

const { Subscriber: UserYield } = createComponents({
  defaultState,
  actions,
});

const UserSelectedState = createSelector(UserYield, selectors.getSelected);

export { UserYield, UserSelectedState };
