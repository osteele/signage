import React from 'react'
import { Grid, Navbar, Row, Jumbotron, Button, Col } from 'react-bootstrap'
import { login, logout } from '../api/auth'
import { AppsProvider, withUser } from '../providers'
import AppList from './AppList'
import PlaylistEditor from './PlaylistEditor'

const Manager = ({ signedIn }) =>
  <div>
    <Header signedIn={signedIn} />

    <AppsProvider>
      <Grid>

      {!signedIn &&
        <Jumbotron>
          <p><Button onClick={login}>Sign in</Button> to edit the playlist.</p>
        </Jumbotron>}

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
  </AppsProvider>

  <Footer />
</div>
export default withUser(Manager)

const Header = ({ signedIn }) =>
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

const Footer = () =>
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

let LoginButton = ({ signedIn }) =>
  signedIn
    ? <Button onClick={logout}>Sign out</Button>
    : <Button onClick={login}>Sign in</Button>

LoginButton = withUser(LoginButton)
