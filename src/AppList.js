import React, { Component } from 'react'
import ReactFireMixin from 'reactfire'
import reactMixin from 'react-mixin'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { ControlLabel, FormGroup, FormControl } from 'react-bootstrap'
import { RIETextArea } from 'riek'
import { FirebaseRef } from './firebase'

const FirebaseAppsRef = FirebaseRef.child('apps')

export default class AppList extends Component {
  firebaseSequenceRef = FirebaseAppsRef

  state = {
    apps: null
  }

  componentDidMount() {
    this.bindAsObject(FirebaseAppsRef, 'apps')
  }

  createItem = (data) =>
    this.firebaseSequenceRef.push({'.priority': Object.keys(this.state.apps).length, ...data})

  removeItemByKey = (key) =>
    this.firebaseSequenceRef.child(key).remove()

  render = () => {
    const apps = this.state.apps
    const keys = Object.keys(apps || {})
      .filter((key) => key[0] !== '.')
      .sort((k0, k1) => {
        const v0 = apps[k0].name.toLowerCase(), v1 = apps[k1].name.toLowerCase()
        return v0 < v1 ? -1 : v0 > v1 ? 1 : 0
      })
    return apps ? (
      <ListGroup>
        {keys.map((key) =>
          <ListGroupItem key={key}>
            <AppInfo app={apps[key]} appKey={key} editable={true} remove={() => this.removeItemByKey(key)} />
          </ListGroupItem>
        )}
        <ListGroupItem>
          <AddAppInfo create={this.createItem} />
        </ListGroupItem>
      </ListGroup>
    ) : <div className="alert alert-info">Loading…</div>
  }
}
reactMixin(AppList.prototype, ReactFireMixin)

class AppInfo extends Component {
  changedState = (state) => {
    const ref = FirebaseAppsRef.child(this.props.appKey)
    for (let [k, v] of Object.entries(state)) {
      ref.child(k).set(v)
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
          {this.props.editable &&
            <i className="fa fa-trash-o pull-right" aria-hidden="true" style={{cursor: 'pointer'}}
              onClick={this.props.remove} />}
      </div>
    )
  }
}

class AddAppInfo extends Component {
  state = { name: "name", url: "url" }

  handleSubmit(event) {
    event.preventDefault()
    this.props.create(this.state)
  }

  handleChange = (propName) => (e) => {
    const state = {}
    state[propName] = e.target.value
    this.setState(state)
  }

  render = () =>
    <form onSubmit={this.handleSubmit.bind(this)}>
      <FormGroup
        controlId="formBasicText"
        >
        <ControlLabel>Add an application</ControlLabel>
        <FormControl type="text"
          placeholder="name"
          onChange={this.handleChange('name')} />
        <FormControl type="text"
          placeholder="URL"
          className="project-url"
          onChange={this.handleChange('url')} />
        <FormControl.Feedback />
      </FormGroup>
      <input type="submit" value="Create" />
    </form>
}
