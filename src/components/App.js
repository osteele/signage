import './App.css'

import React, { Component } from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'

import { AuthProvider } from '../providers'
import Main from './Main'
import Signage from './Signage'
import { assertSchemaVersion } from '../api/firebase'

class App extends Component {

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
export default assertSchemaVersion(App)
