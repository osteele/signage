import React, { Component } from 'react'
import ReactFireMixin from 'reactfire'
import reactMixin from 'react-mixin'
import { ListGroupItem } from 'react-bootstrap'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { FirebaseRef } from '../api/firebase'

export default class Playlist extends Component {
  firebaseSequenceRef = FirebaseRef.child('playlist/sequence')

  state = {
    apps: null,
    sequence: null,
  }

  componentDidMount() {
    this.bindAsObject(FirebaseRef.child('apps'), 'apps')
    this.bindAsArray(this.firebaseSequenceRef, 'sequence')
  }

  createItem = (data) =>
    this.firebaseSequenceRef.push({'.priority': this.state.sequence.length, ...data})

  removeItem = (item) =>
    this.firebaseSequenceRef.child(item['.key']).remove()

  onSortEnd = ({ oldIndex, newIndex }) => {
    arrayMove(this.state.sequence, oldIndex, newIndex).forEach((item, position) =>
      this.firebaseSequenceRef.child(item['.key']).setPriority(position)
    )
  }

  render = () =>
    Object.keys(this.state.apps || {}).length && this.state.sequence ? (
      <div>
        <PlayListSequence
          apps={this.state.apps}
          items={this.state.sequence}
          editable={this.props.editable}
          remove={this.removeItem.bind(this)}
          onSortEnd={this.onSortEnd}
          useDragHandle={true} axis={'y'} />
        {this.props.editable &&
          <ListGroupItem>
            <AddPlayListItem apps={this.state.apps} create={this.createItem} />
          </ListGroupItem>}
      </div>
    ) : <div className="alert alert-info">Loading…</div>
}
reactMixin(Playlist.prototype, ReactFireMixin)

const Handle = SortableHandle(() => <div className="handle" />)

let PlayListItem = ({ item, app, editable, remove }) =>
  <ListGroupItem key={item['.key']}>
    {editable && <Handle />}
    <span>
      {app.name}
      {item.duration && <span> ({item.duration} seconds)</span>}
      {' '}
      {editable &&
        <i className="fa fa-trash-o pull-right" aria-hidden="true" style={{cursor: 'pointer'}}
          onClick={() => remove(item)} />}
    </span>
  </ListGroupItem>
PlayListItem = SortableElement(PlayListItem)

let PlayListSequence = ({ apps, items, editable, remove }) =>
  <div>
    {items.map((item, index) =>
      <PlayListItem item={item} key={item['.key']} index={index}
        app={apps[item.app]} editable={editable} remove={remove} />)}
  </div>
PlayListSequence = SortableContainer(PlayListSequence)

class AddPlayListItem extends Component {
  state = { app: 0 }

  handleSubmit(event) {
    event.preventDefault()
    this.props.create(this.state)
  }

  render() {
    if (!this.props.apps) return null
    const keys = Object.keys(this.props.apps).filter((k) => k[0] !== '.')
    return <form onSubmit={this.handleSubmit.bind(this)}>
      <label>
        Application:
        <select defaultValue={this.props.apps[0]['.key']}
            onChange={(e) => this.setState({app: e.target.value})}>
          {keys.map((key) =>
            <option key={key} value={key}>
              {this.props.apps[key].name}
            </option>)}
        </select>
      </label>
      <input type="submit" value="Add" />
    </form>
  }
}
