import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactFireMixin from 'reactfire'
import reactMixin from 'react-mixin'
import { firebaseRef } from './api/firebase'

export class AppStoreProvider extends Component {
  state = { apps: null }

  static childContextTypes = {
    apps: PropTypes.object,
    appKeys: PropTypes.array,
    appsLoaded: PropTypes.bool.isRequired,
  }

  getChildContext() {
    const { apps } = this.state
    return {
      apps: apps,
      appKeys: Object.keys(apps || {}).filter((key) => key[0] !== '.'),
      appsLoaded: Object.keys(apps || {}).length > 0,
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
      appKeys: PropTypes.array,
      appsLoaded: PropTypes.bool.isRequired,
    }

    render() {
      const { apps, appKeys, appsLoaded } = this.context
      return (
        <ComponentToWrap {...this.props} apps={apps}
          appKeys={appKeys} appsLoaded={appsLoaded} />
      )
    }
  }
}
