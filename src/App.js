import React, { Component } from 'react';
import logo from './logo.svg';
import Firebase from 'firebase'
import ReactFireMixin from 'reactfire';
import reactMixin from 'react-mixin';
import { FirebaseConfig } from './firebase-config';
import './App.css';

Firebase.initializeApp(FirebaseConfig);
Firebase.auth();
var ref = Firebase.database().ref();

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


class AppInfoList extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      apps: []
    }
  }

  componentDidMount() {
    this.bindAsArray(ref.child('apps'), 'apps')
  }

  renderItem(user) {
    return <li><a href="{user.url}" target="_"><code>{user.url}</code></a></li>
  }

  render() {
    return (
      <div>
        <h2>Screens</h2>
        <ul>
          {this.state.apps.map(this.renderItem)}
        </ul>
      </div>
    )
  }
}

reactMixin(AppInfoList.prototype, ReactFireMixin)

export default App;
