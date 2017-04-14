import { Button, ButtonGroup, ControlLabel, Form, FormControl, ListGroupItem } from 'react-bootstrap'
import React, { Component } from 'react'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'

import { Link } from 'react-router-dom'
import ReactFireMixin from 'reactfire'
import { firebaseRef } from '../api/firebase'
import reactMixin from 'react-mixin'
import { withAppContext } from '../providers'

const playlistItemsRef = firebaseRef.child('playlist/sequence')

const addPlaylistItem = (playlist, data) =>
  playlistItemsRef.push({'.priority': playlist.sequence.length, ...data})

const removePlaylistItem = (playlist, item) =>
  playlistItemsRef.child(item['.key']).remove()

const movePlaylistItem = (playlist, oldIndex, newIndex) =>
  arrayMove(playlist.sequence, oldIndex, newIndex).forEach((item, position) =>
    playlistItemsRef.child(item['.key']).setPriority(position)
  )

class Playlist extends Component {
  sequenceRef = firebaseRef.child('playlist/sequence')

  state = {
    sequence: null,
  }

  componentDidMount() {
    this.bindAsArray(this.sequenceRef, 'sequence')
  }

  render = () => {
    if (!this.props.appsLoaded || !this.state.sequence)
      return <div className="alert alert-info">Loading…</div>

    return (
      <div>
        <ButtonGroup>
          <Button title="Run in wireframe mode">
            <Link to="/preview">
              <i className="fa fa-square-o" />
            </Link>
          </Button>
          <Button title="Run the playlist">
            <Link to="/display">
              <i className="fa fa-desktop" />
            </Link>
          </Button>
        </ButtonGroup>

        <PlayListSequence
          apps={this.props.apps}
          items={this.state.sequence}
          editable={this.props.editable}
          remove={removePlaylistItem.bind(null, this.state)}
          onSortEnd={({oldIndex, newIndex}) => movePlaylistItem(this.state, oldIndex, newIndex)}
          useDragHandle={true} axis={'y'} />

        {this.props.editable &&
          <ListGroupItem>
            <AddPlayListItem apps={this.props.apps} create={addPlaylistItem.bind(null, this.state)} />
          </ListGroupItem>}
      </div>
    )
  }
}
reactMixin(Playlist.prototype, ReactFireMixin)
export default withAppContext(Playlist)

const DragHandle = SortableHandle(() => <div className="handle" />)

let PlayListItem = ({ item, key, app, editable, remove }) =>
  <ListGroupItem key={key}>
    {editable && <DragHandle />}
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
    const keys = Object.keys(this.props.apps).filter((k) => k[0] !== '.')
    return <Form inline onSubmit={this.handleSubmit.bind(this)}>
      <ControlLabel>Application:&nbsp;</ControlLabel>
      <FormControl componentClass="select"
          defaultValue={this.props.apps[0]['.key']}
          onChange={(e) => this.setState({app: e.target.value})}>
        {keys.map((key) =>
          <option key={key} value={key}>
            {this.props.apps[key].name}
          </option>)}
      </FormControl>
      <Button type="submit" bsSize="small" className="pull-right">Add</Button>
    </Form>
  }
}
