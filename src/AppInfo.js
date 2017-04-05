import React, { Component } from 'react'
import ReactFireMixin from 'reactfire'
import reactMixin from 'react-mixin'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { RIETextArea } from 'riek'
import { FirebaseRef } from './firebase'

const FirebaseAppsRef = FirebaseRef.child('apps')

export default class AppInfoList extends Component {
  state = {
    apps: null
  }

  componentDidMount() {
    this.bindAsArray(FirebaseAppsRef, 'apps')
  }

  renderItem(app) {
    return (
      <ListGroupItem key={app['.key']}>
        <AppInfo app={app} />
      </ListGroupItem>
    )
  }

  render = () =>
    this.state.apps ? (
      <ListGroup>
        {this.state.apps.map(this.renderItem)}
      </ListGroup>
    ) : <div className="alert alert-info">Loading…</div>
}
reactMixin(AppInfoList.prototype, ReactFireMixin)

class AppInfo extends Component {
  changedState = (state) => {
    const app = this.props.app
    for (let [k, v] of Object.entries(state)) {
      FirebaseAppsRef.child(app['.key']).child(k).set(v)
    }
  }

  isWellFormedURL = (url) => url.match(/^https?:\/\/.+/)

  render() {
    const app = this.props.app
    return (
      <div>
        <h3>{app.name}
          <small> (<a href="{app.url}" target="_">site</a>)</small>
        </h3>
        <code><RIETextArea
          value={app.url}
          change={this.changedState}
          propName='url'
          validate={this.isWellFormedURL}
          className='project-url'
          classInvalid='invalid' /></code>
      </div>
    )
  }
}
