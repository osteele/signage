import React from 'react';
import logo from './logo.svg';
import { AppInfoList } from './AppInfo';
import { Playlist } from './Playlist';
import { SignageScreen } from './SignageScreen'
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const Manager = () => (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>Digital Signage Manager</h2>
    </div>
    <p className="App-intro">
      This application manages webapp-backed digital signage.
    </p>
    <p>
      It manages a list of applications, and a playlist that sequences
      those applications.
    </p>
    <p>
      Preview the animation with placeholders at <Link to="/preview">{document.location.origin}/preview</Link>.
    </p>
    <p>
      Direct the digital signage to <Link to="/preview">{document.location.origin}/preview</Link>.
    </p>
    <AppInfoList />
    <Playlist />
  </div>
)

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={SignageScreen} />
      <Route exact path="/preview" component={() => <SignageScreen dummy={true} />} />
      <Route exact path="/manage" component={Manager} />
    </div>
  </Router>
)

export default App;
