import './App.css'

import React, { Component } from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'

import { AuthProvider } from '../providers'
import Main from './Main'
import Signage from './Signage'
import { firebaseRef } from '../api/firebase'

const FIREBASE_SCHEMA_FORMAT = 1

export default class App extends Component {
  componentDidMount() {
    firebaseRef.child('version').on('value', (snapshot) => {
      if (snapshot.val() !== FIREBASE_SCHEMA_FORMAT) {
        window.location.reload()
      }
    })
  }

  render = () =>
    <AuthProvider>
      <Router>
        <div>
          <Route exact path="/" component={Main} />
          <Route exact path="/preview" component={() => <Signage wireframe={true} />} />
          <Route exact path="/display" component={Signage} />
        </div>
      </Router>
    </AuthProvider>
}
