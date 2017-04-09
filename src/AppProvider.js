import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactFireMixin from 'reactfire'
import reactMixin from 'react-mixin'
import { firebaseRef } from './api/firebase'

export class AppStoreProvider extends Component {
  state = { apps: null }

  static childContextTypes = {
    apps: PropTypes.object,
    appsLoaded: PropTypes.bool.isRequired,
  }

  getChildContext() {
    return {
      apps: this.state.apps,
      appsLoaded: Object.keys(this.state.apps || {}).length > 0,
    }
  }

  componentDidMount() {
    this.bindAsObject(firebaseRef.child('apps'), 'apps')
  }

  render() {
    return React.Children.only(this.props.children)
  }
}
reactMixin(AppStoreProvider.prototype, ReactFireMixin)

export const withAppContext = (ComponentToWrap) => {
  return class ExtendedComponent extends Component {
    static contextTypes = {
      apps: PropTypes.object,
      appsLoaded: PropTypes.bool.isRequired,
    }

    render() {
      const { apps, appsLoaded } = this.context
      return (
        <ComponentToWrap {...this.props} apps={apps} appsLoaded={appsLoaded} />
      )
    }
  }
}
