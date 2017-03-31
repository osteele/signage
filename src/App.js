import React, { Component } from 'react';
import logo from './logo.svg';
import { AppInfoList } from './AppInfo';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Signage Manager</h2>
        </div>
        <p className="App-intro">
          Manager for Olin Library digital signage.
        </p>
        <AppInfoList />
      </div>
    );
  }
}

export default App;
