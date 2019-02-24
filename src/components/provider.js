import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Provider } from '../context';
import { StoreRegistry } from '../store';

export default class AdoneProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    initialStates: PropTypes.object,
  };

  static defaultProps = {
    initialStates: {},
  };

  constructor(props) {
    super(props);
    this.registry = new StoreRegistry();
    this.registry.configure({
      initialStates: props.initialStates,
    });
    this.state = {
      globalRegistry: this.registry,
      getStore: this.registry.getStore,
    };
  }

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}
