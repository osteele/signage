import React, { Component } from 'react'
import Firebase from 'firebase'
import FirebaseConfig from '../config/firebase.json'
import _ from 'lodash'

export { Firebase }

Firebase.initializeApp(FirebaseConfig)
Firebase.auth()

export const firebaseRef = Firebase.database().ref()
export const firebaseAuth = Firebase.auth

const firebaseVersionRef = firebaseRef.child('version')
const FIREBASE_SCHEMA_FORMAT = 2

export function connect(propMap, WrappedComponent) {
  var unmounters

  return class extends Component {
    constructor(props) {
        super(props)
        unmounters = _.map(propMap, (fbPath, propName) => {
            const ref = firebaseRef.child(fbPath)
            const listener = (snapshot) => this.setState({[propName]:  snapshot.val()})
            ref.on('value', listener, console.error)
            return () => ref.off('value', listener)
        })
    }

    componentWillUnmount() {
        unmounters.forEach((fn) => fn())
    }

    render = () =>
        <WrappedComponent {...this.props} {...this.state} />
  }
}

export function assertSchemaVersion(WrappedComponent) {
  var listener

  return class extends Component {
    componentDidMount() {
        listener = firebaseVersionRef.on('value', (snapshot) => {
            if (snapshot.val() !== FIREBASE_SCHEMA_FORMAT) {
                window.location.reload()
            }
        })
    }

    componentWillUnmount() {
        firebaseVersionRef.off('value', listener)
    }

    render = () =>
        <WrappedComponent {...this.props} {...this.state} />
    }
  }
