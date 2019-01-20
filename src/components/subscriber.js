import { Component } from 'react';
import PropTypes from 'prop-types';

import { readContext } from '../context';
import shallowEqual from '../utils/shallow-equal';

export default class Subscriber extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  static basketType = null;
  static selector = state => state;

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
    // ensure subscription is still to the correct basket
    // as parent scope might change between renders
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
    // eslint-disable-next-line no-unused-vars
    const { children, ...props } = this.props;
    const { selector } = this.constructor;
    // We can get baskets from context ONLY during rendering phase
    // overwise react will fallback to the default ctx value
    this.basket = fromContext ? this.getInstanceFromContext() : this.basket;
    const state = this.basket.store.getState();
    return selector ? selector(state, props) : {};
  }

  getInstanceFromContext() {
    const { basketType } = this.constructor;
    // We use React context just to get the baskets registry
    // then we rely on our internal pub/sub to get updates
    // because context API doesn't have builtin selectors (yet).
    const ctx = readContext();
    return ctx.getBasket(basketType);
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
    // Ensure component is still mounted and has a basket attached
    if (!this.basket) return;
    const prevState = this.state;
    const nextState = this.getBasketState();
    // Only update if state changed
    if (!shallowEqual(prevState, nextState)) {
      this.setState(nextState);
    }
  };

  render() {
    // Get fresh state at every re-render, so if a parent triggers
    // a re-render before the componet subscription calls onUpdate()
    // we already serve the updated state and skip the additional render
    this.state = this.getBasketState(true);
    return this.props.children({ ...this.state, ...this.basket.actions });
  }
}
