// @flow

import React from 'react'
import { Button, Col, Grid, Jumbotron, Navbar, Row } from 'react-bootstrap'

import AssetList from './AssetList'
import Playlist from './Playlist'
import { login, logout } from '../api/auth'
import { connect } from '../api/firebase'
import { AssetsProvider, withUser } from '../providers'
import _ from 'lodash'

const Main = ({ signedIn, playlists }) =>
  <div>
    <Header signedIn={signedIn} />

    <AssetsProvider>
      <Grid>

      {!signedIn &&
        <Jumbotron>
          <p><Button onClick={login}>Sign in</Button> to edit the playlist.</p>
        </Jumbotron>}

      <Row>
        <Col xs={6}>
          <h2>Playlists</h2>
          {playlists && _.map(playlists, (playlist, key) =>
            <Playlist key={key} playlist={playlist} id={key} editable={signedIn} />)}
        </Col>

        <Col xs={6}>
          <h2>Assets</h2>
          <AssetList editable={signedIn} />
        </Col>
      </Row>
    </Grid>
  </AssetsProvider>

  <Footer />
</div>
export default withUser(connect({'playlists': 'playlists'}, Main))

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
        It manages a list of assets, and a playlist that sequences
        those assets.
      </p>
    </div>
  </footer>

let LoginButton = ({ signedIn }) =>
  signedIn
    ? <Button onClick={logout}>Sign out</Button>
    : <Button onClick={login}>Sign in</Button>

LoginButton = withUser(LoginButton)
