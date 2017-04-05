import React, { Component } from 'react'
import ReactFireMixin from 'reactfire'
import reactMixin from 'react-mixin'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { RIETextArea } from 'riek'
import { FirebaseRef } from './firebase'

const FirebaseAppsRef = FirebaseRef.child('apps')

export default class AppInfoList extends Component {
  firebaseSequenceRef = FirebaseAppsRef

  state = {
    apps: null
  }

  componentDidMount() {
    this.bindAsObject(FirebaseAppsRef, 'apps')
  }

  removeItemByKey = (key) =>
    this.firebaseSequenceRef.child(key).remove()

  render = () => {
    return this.state.apps ? (
      <ListGroup>
        {this.state.apps.map((app, key) =>
          <ListGroupItem key={key}>
            <AppInfo app={app} remove={() => this.removeItemByKey(key)} />
          </ListGroupItem>
        )}
      </ListGroup>
    ) : <div className="alert alert-info">Loading…</div>
  }
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
    const editable = true
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
          {editable &&
            <i className="fa fa-trash-o pull-right" aria-hidden="true" style={{cursor: 'pointer'}}
              onClick={this.props.remove} />}
      </div>
    )
  }
}
