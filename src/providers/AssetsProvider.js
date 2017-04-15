import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactFireMixin from 'reactfire'
import reactMixin from 'react-mixin'

import { firebaseRef } from '../api/firebase'

export class AssetsProvider extends Component {
  state = { assets: null }

  static childContextTypes = {
    assets: PropTypes.object,
    assetKeys: PropTypes.array,
    assetsLoaded: PropTypes.bool.isRequired,
  }

  getChildContext() {
    const { assets } = this.state
    return {
      assets: assets,
      assetKeys: Object.keys(assets || {}).filter((key) => key[0] !== '.'),
      assetsLoaded: Object.keys(assets || {}).length > 0,
    }
  }

  componentDidMount() {
    this.bindAsObject(firebaseRef.child('assets'), 'assets')
  }

  render() {
    return React.Children.only(this.props.children)
  }
}
reactMixin(AssetsProvider.prototype, ReactFireMixin)

export const withAssetContext = (WrappedComponent) =>
  class extends Component {
    static contextTypes = {
      assets: PropTypes.object,
      assetKeys: PropTypes.array,
      assetsLoaded: PropTypes.bool.isRequired,
    }

    render() {
      const { assets, assetKeys, assetsLoaded } = this.context
      return (
        <WrappedComponent {...this.props}
          assets={assets}
          assetKeys={assetKeys}
          assetsLoaded={assetsLoaded}
          />
      )
    }
  }
