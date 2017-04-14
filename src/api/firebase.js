import React, { Component } from 'react'
import Firebase from 'firebase'
import FirebaseConfig from '../config/firebase.json'
import _ from 'lodash'

export { Firebase }

Firebase.initializeApp(FirebaseConfig)
Firebase.auth()

export const firebaseRef = Firebase.database().ref()
export const firebaseAuth = Firebase.auth

export const connect = (propMap, WrappedComponent) =>
  class extends Component {
    constructor(props) {
        super(props)
        this.unmounters = _.map(propMap, (fbPath, propName) => {
            const ref = firebaseRef.child(fbPath)
            const listener = (snapshot) => this.setState({[propName]:  snapshot.val()})
            ref.on('value', listener, console.error)
            return () => ref.off('value', listener)
        })
    }

    componentWillUnmount() {
        this.unmounters.forEach((fn) => fn())
    }

    render = () =>
        <WrappedComponent {...this.props} {...this.state} />
  }
