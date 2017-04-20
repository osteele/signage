import './App.css'

import React from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'

import { AuthProvider } from '../providers'
import Main from './Main'
import Signage from './Signage'
import { assertSchemaVersion } from '../api/firebase'

const App = () =>
  <AuthProvider>
    <Router>
      <div>
        <Route exact path="/" component={Main} />
        <Route exact path="/preview/:id" component={({match}) => <Signage id={match.params.id} wireframe={true} />} />
        <Route exact path="/display/:id" component={({match}) => <Signage id={match.params.id} />} />
      </div>
    </Router>
  </AuthProvider>
export default assertSchemaVersion(App)
