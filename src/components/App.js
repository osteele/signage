import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { firebaseRef } from '../api/firebase'
import { AuthProvider } from '../providers'
import SignageScreen from './SignageScreen'
import Main from './Main'
import './App.css'

const FIREBASE_SCHEMA_FORMAT = 1

class App extends Component {
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
          <Route exact path="/view" component={SignageScreen} />
          <Route exact path="/preview" component={() => <SignageScreen dummy={true} />} />
        </div>
      </Router>
    </AuthProvider>
}

export default App
