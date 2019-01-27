import { Component } from 'react';
import PropTypes from 'prop-types';

import { readContext } from '../context';
import memoize from '../utils/memoize';

export default class Subscriber extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  static basketType = null;
  static selector = state => state;

  static getDerivedStateFromProps(nextProps, prevState) {
    // Get fresh state at every re-render, so if a parent triggers
    // a re-render before the component subscription calls onUpdate()
    // we already serve the updated state and skip the additional render
    const nextBasketState = prevState.getBasketState(nextProps, true);
    // just check simple equality as shallow check done by memoized selector
    if (prevState.basketState !== nextBasketState) {
      return { basketState: nextBasketState };
    }
    return null;
  }

  basket = null;
  subscription = null;
  selector = this.constructor.selector && memoize(this.constructor.selector);

  constructor(props) {
    super(props);
    this.state = {
      basketState: {},
      // stored to make them available in getDerivedStateFromProps
      // as js context there is null https://github.com/facebook/react/issues/12612
      getBasketState: this.getBasketState,
    };
  }

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

  getBasketState = (nextProps = this.props, fromContext = false) => {
    // eslint-disable-next-line no-unused-vars
    const { children, ...props } = nextProps;
    // We can get baskets from context ONLY during rendering phase
    // overwise React will return the default ctx value!
    this.basket = fromContext
      ? this.getBasketInstanceFromContext()
      : this.basket;
    const basketState = this.basket.store.getState();
    return this.selector
      ? this.selector(basketState, props)
      : this.state.basketState;
  };

  getBasketInstanceFromContext() {
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

  onUpdate = basketState => {
    // Ensure component is still mounted and has a basket attached
    if (!this.basket) return;
    const prevBasketState = this.state.basketState;
    const nextBasketState = basketState || this.getBasketState();
    // Only update if state changed
    // just check simple equality as shallow check done by memoized selector
    if (prevBasketState !== nextBasketState) {
      this.setState({ basketState: nextBasketState });
    }
  };

  render() {
    return this.props.children({
      ...this.state.basketState,
      ...this.basket.actions,
    });
  }
}
