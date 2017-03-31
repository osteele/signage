import React from 'react';
import logo from './logo.svg';
import { AppInfoList } from './AppInfo';
import { SignageScreen } from './SignageScreen'
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  // Link
} from 'react-router-dom'

const Manage = () => (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>Signage Manager</h2>
    </div>
    <p className="App-intro">
      Manager for Olin Library digital signage.
    </p>
    <AppInfoList/>
  </div>
)

// const xSignageScreen = () => (
//   <div>
//     <h1>Home</h1>
//   </div>
// )

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={SignageScreen}/>
      <Route path="/manage" component={Manage}/>
    </div>
  </Router>
)

export default App;
