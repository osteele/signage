import React, { Component } from 'react'
import { Grid, Navbar, Row, Jumbotron, Button, Col } from 'react-bootstrap'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { login, logout } from '../api/auth'
import { firebaseRef } from '../api/firebase'
import { Provider, withUser } from '../Provider'
import AppList from './AppList'
import PlaylistEditor from './PlaylistEditor'
import SignageScreen from './SignageScreen'
import './App.css'

const FIREBASE_SCHEMA_FORMAT = 1

let Manager = ({ signedIn }) =>
  <div>
    <Navbar>
      <Grid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Digital Signage Manager</a>
          </Navbar.Brand>
          <Navbar.Toggle />
          <LoginButton signedIn={signedIn} />
        </Navbar.Header>
      </Grid>
    </Navbar>

    {!signedIn &&
      <Grid>
        <Jumbotron>
          <p><Button onClick={login}>Sign in</Button> to edit the playlist.</p>
        </Jumbotron>
      </Grid>}

    <Grid>
      <Row>
        <Col xs={6}>
          <h2>Playlist</h2>
          <PlaylistEditor editable={signedIn} />
        </Col>
        <Col xs={6}>
          <h2>Applications</h2>
          <AppList />
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
Manager = withUser(Manager)

let LoginButton = ({ signedIn }) =>
  signedIn
    ? <Button onClick={logout}>Sign out</Button>
    : <Button onClick={login}>Sign in</Button>

LoginButton = withUser(LoginButton)

class App extends Component {
  componentDidMount() {
    firebaseRef.child('version').on('value', (snapshot) => {
      if (snapshot.val() !== FIREBASE_SCHEMA_FORMAT) {
        window.location.reload()
      }
    })
  }

  render = () =>
    <Provider>
      <Router>
        <div>
          <Route exact path="/" component={Manager} />
          <Route exact path="/view" component={SignageScreen} />
          <Route exact path="/preview" component={() => <SignageScreen dummy={true} />} />
        </div>
      </Router>
    </Provider>
}

export default App
