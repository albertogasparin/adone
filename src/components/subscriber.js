import { Component } from 'react';
import PropTypes from 'prop-types';

import { readContext } from '../context';
import memoize from '../utils/memoize';

export default class Subscriber extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  static storeType = null;
  static selector = state => state;

  static getDerivedStateFromProps(nextProps, prevState) {
    // Get fresh state at every re-render, so if a parent triggers
    // a re-render before the component subscription calls onUpdate()
    // we already serve the updated state and skip the additional render
    const nextStoreStateValue = prevState.getStoreStateValue(nextProps, true);
    // just check simple equality as shallow check done by memoized selector
    if (prevState.storeStateValue !== nextStoreStateValue) {
      return { storeStateValue: nextStoreStateValue };
    }
    return null;
  }

  store = null;
  subscription = null;
  selector = this.constructor.selector && memoize(this.constructor.selector);

  constructor(props) {
    super(props);
    this.state = {
      storeStateValue: {},
      // stored to make them available in getDerivedStateFromProps
      // as js context there is null https://github.com/facebook/react/issues/12612
      getStoreStateValue: this.getStoreStateValue,
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
    // ensure subscription is still to the correct store
    // as parent scope might change between renders
    this.subscribeToUpdates();
  }

  componentWillUnmount() {
    this.store = null;
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  getStoreStateValue = (nextProps = this.props, fromContext = false) => {
    // eslint-disable-next-line no-unused-vars
    const { children, ...props } = nextProps;
    // We can get stores from context ONLY during rendering phase
    // overwise React will return the default ctx value!
    this.store = fromContext ? this.getStoreFromContext() : this.store;
    const currentStoreState = this.store.storeState.getState();
    return this.selector
      ? this.selector(currentStoreState, props)
      : this.state.storeStateValue;
  };

  getStoreFromContext() {
    const { storeType } = this.constructor;
    // We use React context just to get the stores registry
    // then we rely on our internal pub/sub to get updates
    // because context API doesn't have builtin selectors (yet).
    const ctx = readContext();
    return ctx.getStore(storeType);
  }

  subscribeToUpdates() {
    // in case store has been recreated during an update (due to scope change)
    if (this.subscription && this.subscription.store !== this.store) {
      this.subscription.remove();
      this.subscription = null;
    }
    if (!this.subscription) {
      this.subscription = {
        store: this.store,
        remove: this.store.storeState.subscribe(this.onUpdate),
      };
    }
  }

  onUpdate = () => {
    // Ensure component is still mounted and has a store attached
    if (!this.store) return;
    const prevStoreStateValue = this.state.storeStateValue;
    const nextStoreStateValue = this.getStoreStateValue();
    // Only update if state changed
    // just check simple equality as shallow check done by memoized selector
    if (prevStoreStateValue !== nextStoreStateValue) {
      // nextState will recalculated by gDSFP anyway
      this.setState({ storeStateValue: nextStoreStateValue });
    }
  };

  render() {
    // this is needed for compat with React<16.5
    // as gDSFP in not called before first render
    const storeStateValue = this.store
      ? this.state.storeStateValue
      : this.getStoreStateValue(this.props, true);
    return this.props.children(storeStateValue, this.store.actions);
  }
}
