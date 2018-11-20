// @flow

import { Yield, createComponents } from 'react-adone';
import type { State } from './types';

import * as actions from './actions';
import * as selectors from './selectors';

const defaultState: State = {
  selected: null,
  data: null,
  loading: false,
};

const { Yield: UserYield } = createComponents({
  defaultState,
  actions,
});

export class UserSelectedState extends Yield<*, *, *> {
  static defaultProps = {
    ...(UserYield: any).defaultProps,
    pick: selectors.getSelected,
  };
}

export { UserYield };
