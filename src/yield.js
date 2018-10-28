import { Component } from 'react';
import PropTypes from 'prop-types';

import { readContext } from './context';
import shallowEqual from './utils/shallow-equal';

export default class Yield extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    from: PropTypes.shape({
      key: PropTypes.string.isRequired,
      defaultState: PropTypes.object.isRequired,
      actions: PropTypes.object.isRequired,
    }).isRequired,
    pick: PropTypes.func,
    withProps: PropTypes.object,
  };

  basket = null;
  subscription = null;
  state = null;

  componentDidMount() {
    // As suggested by the async docs, we add listener after mount
    // So it won't leak if mount is interrupted or errors
    // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
    this.subscribeToUpdates();

    // Moreover, when async render, state could change between render and mount
    // so to ensure state is fresh we should manually call onUpdate and
    // potentially causing a de-opts to synchronous rendering (should be rare)
    // https://github.com/facebook/react/issues/13186#issuecomment-403959161
    this.onUpdate();
  }

  componentDidUpdate() {
    this.subscribeToUpdates();
  }

  componentWillUnmount() {
    this.basket = null;
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  getBasketState(fromContext = false) {
    const { pick, withProps } = this.props;
    // We can get baskets from context ONLY during rendering phase
    // overwise react will fallback to the default ctx value
    this.basket = fromContext ? this.getBasketFromContext() : this.basket;
    const state = this.basket.store.getState();
    return pick ? pick(state, withProps) : state;
  }

  getBasketFromContext() {
    const { from } = this.props;
    // We use React context just to get the baskets registry
    // then we rely on our internal pub/sub to get updates
    // because context API doesn't have builtin selectors (yet).
    const ctx = readContext();
    return ctx.getBasket(from);
  }

  subscribeToUpdates() {
    // in case basket has been recreated during an update (due to scope change)
    if (this.subscription && this.subscription.basket !== this.basket) {
      this.subscription.remove();
      this.subscription = null;
    }
    if (!this.subscription) {
      this.subscription = {
        basket: this.basket,
        remove: this.basket.store.subscribe(this.onUpdate),
      };
    }
  }

  onUpdate = () => {
    if (!this.basket) return;
    const prevState = this.state;
    const nextState = this.getBasketState();
    // we could call setState but in reality Adone uses state only for
    // better dev experience, so assigning it sync and calling forceUpdate
    // is harmless (ReactFiberNewContext uses FU too)
    this.state = nextState;
    if (!shallowEqual(prevState, nextState)) {
      this.forceUpdate();
    }
  };

  render() {
    // Get fresh state at every re-render, so if a parent triggers
    // a re-render before the componet subscription calls onUpdate()
    // we already serve the updated state and skip an additional render
    this.state = this.getBasketState(true);
    return this.props.children({ ...this.state, ...this.basket.actions });
  }
}
