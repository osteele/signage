import React, { Component } from 'react'

import PropTypes from 'prop-types'
import ReactFireMixin from 'reactfire'
import { firebaseRef } from '../api/firebase'
import reactMixin from 'react-mixin'

export class AppsProvider extends Component {
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
reactMixin(AppsProvider.prototype, ReactFireMixin)

export const withAppContext = (WrappedComponent) => {
  return class extends Component {
    static contextTypes = {
      apps: PropTypes.object,
      appKeys: PropTypes.array,
      appsLoaded: PropTypes.bool.isRequired,
    }

    render() {
      const { apps, appKeys, appsLoaded } = this.context
      return (
        <WrappedComponent {...this.props} apps={apps}
          appKeys={appKeys} appsLoaded={appsLoaded} />
      )
    }
  }
}
