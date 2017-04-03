import React, { Component } from 'react';
import { Grid, Navbar, Row, Jumbotron, Button, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { login, logout, onAuthStateChanged } from './auth'
import AppInfoList from './AppInfo';
import Playlist from './Playlist';
import SignageScreen from './SignageScreen'
import './App.css';

const Manager = () => (
  <div>
    <Navbar>
      <Grid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Digital Signage Manager</a>
          </Navbar.Brand>
          <Navbar.Toggle />
          <LoginButton />
        </Navbar.Header>
      </Grid>
    </Navbar>

    <Grid>
      <Jumbotron>
        <p>Sign in to edit the playlist.</p>
        <p>
          Preview the sequence, with placeholders, at <Link to="/preview">{document.location.origin}/preview</Link>.
        </p>
        <p>
          Open <Link to="/view">{document.location.origin}/view</Link> on the screen
          that is displaying the digital signage.
        </p>
      </Jumbotron>
    </Grid>

    <Grid>
      <Row>
        <Col xs={6}>
          <h2>Playlist</h2>
          <Playlist />
        </Col>
        <Col xs={6}>
          <h2>Applications</h2>
          <AppInfoList />
        </Col>
      </Row>
    </Grid>

    <footer className="footer">
      <div className="container">
        <p className="text-muted">
          This application manages digital signage.
        </p>
        <p className="text-muted">
          It manages a list of applications, and a playlist that sequences
          those applications.
        </p>
      </div>
    </footer>
  </div>
)

class LoginButton extends Component {
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
      ? <Button onClick={logout}>Sign out</Button>
      : <Button onClick={login}>Sign in</Button>;
  }
}

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={Manager} />
      <Route exact path="/view" component={SignageScreen} />
      <Route exact path="/preview" component={() => <SignageScreen dummy={true} />} />
    </div>
  </Router>
)

export default App;
