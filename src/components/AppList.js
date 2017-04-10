import React, { Component } from 'react'
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import { ControlLabel, FormControl } from 'react-bootstrap'
import { RIEInput, RIETextArea } from 'riek'
import { firebaseRef } from '../api/firebase'
import { withAppContext } from '../providers'

const firebaseAppsRef = firebaseRef.child('apps')

class AppList extends Component {
  firebaseAppsRef = firebaseAppsRef

  createItem = (data) =>
    this.firebaseSequenceRef.push({'.priority': this.props.appKeys.length, ...data})

  removeItemByKey = (key) =>
    this.firebaseSequenceRef.child(key).remove()

  render = () => {
    const apps = this.props.apps
    const keys = this.props.appKeys.sort((k0, k1) => {
        const n0 = apps[k0].name, n1 = apps[k1].name
        return n0.localeCompare(n1)
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
export default withAppContext(AppList)

class AppInfo extends Component {
  changedState = (state) => {
    const ref = firebaseAppsRef.child(this.props.appKey)
    for (let [k, v] of Object.entries(state)) {
      ref.child(k).set(v.trim())
    }
  }

  appNameIsValid = (name) => name.trim().match(/./)
  urlIsValid = (url) => url.match(/^https?:\/\/.+/)

  render() {
    const app = this.props.app
    return (
      <div>
        {this.props.editable &&
          <i className="fa fa-trash-o pull-right" aria-hidden="true" style={{cursor: 'pointer'}}
            onClick={this.props.remove} />}
        <h3>
          <RIEInput
            value={app.name}
            change={this.changedState}
            propName='name'
            validate={this.appNameIsValid}
            classInvalid='invalid' />
        </h3>
        <a className="fa fa-external-link" href="{app.url}" target="_"></a>
        {' '}
        <RIETextArea
          value={app.url}
          change={this.changedState}
          propName='url'
          validate={this.urlIsValid}
          className='project-url'
          classInvalid='invalid' />
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
      <ControlLabel>Add an application</ControlLabel>
      <FormControl type="text"
        placeholder="name"
        onChange={this.handleChange('name')} />
      <FormControl type="text"
        placeholder="URL"
        className="project-url"
        onChange={this.handleChange('url')} />
      <FormControl.Feedback />
      <Button type="submit">Create</Button>
    </form>
}
