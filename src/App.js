import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import logo from './logo.svg';
import {login, logout, isLoggedIn, onAuthStateChanged} from './auth'
import AppInfoList from './AppInfo';
import Playlist from './Playlist';
import SignageScreen from './SignageScreen'
import './App.css';

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
      Preview the sequence, with placeholders, at <Link to="/preview">{document.location.origin}/preview</Link>.
    </p>
    <p>
      Open <Link to="/preview">{document.location.origin}/preview</Link> on the screen
      that is displaying the digital signage.
    </p>
    <LoginButton />
    <Playlist />
    <AppInfoList />
  </div>
)

class LoginButton extends React.Component {
  state = { user_uid: 0 };

  constructor(props, context) {
    super(props, context);
    this.props = props;
    onAuthStateChanged(
      (user) => this.setState({user_uid: user && user.uid}));
  }

  isLoggedIn() {
    return Boolean(this.state.user_uid);
  }

  render() {
    return this.isLoggedIn()
      ? <button onClick={logout}>Sign out</button>
      : <button onClick={login}>Sign in</button>;
  }
}

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
