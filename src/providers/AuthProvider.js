import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { onAuthStateChanged } from '../api/auth'

export class AuthProvider extends Component {
  state = { user: null }

  static childContextTypes = {
    signedIn: PropTypes.bool.isRequired,
  }

  getChildContext() {
    return {
      signedIn: Boolean(this.state.user),
    }
  }

  componentDidMount() {
    onAuthStateChanged((user) => this.setState({ user }))
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

export const withUser = (WrappedComponent) => {
  return class extends Component {
    static contextTypes = {
      signedIn: PropTypes.bool.isRequired,
    }

    render() {
      const { signedIn } = this.context
      return (
        <WrappedComponent {...this.props} signedIn={signedIn} />
      )
    }
  }
}
