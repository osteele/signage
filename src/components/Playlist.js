import { Button, ButtonGroup, ControlLabel, Form, FormControl, ListGroupItem } from 'react-bootstrap'
import React, { Component } from 'react'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { Link } from 'react-router-dom'

import { firebaseRef } from '../api/firebase'
import { withAppContext } from '../providers'
import { connect } from '../api/firebase'

const playlistItemsRef = (id) =>
  firebaseRef.child('playlists').child(id).child('sequence')

const appendPlaylistItem = (id, position, data) =>
  playlistItemsRef(id).push({'.priority': position, ...data})

const deletePlaylistItem = (playlist_id, item) => {
  playlistItemsRef(playlist_id).child(item['.key']).remove()
}

const movePlaylistItem = (id, sequence, oldIndex, newIndex) =>
  arrayMove(sequence, oldIndex, newIndex).forEach((item, position) =>
    playlistItemsRef(id).child(item['.key']).setPriority(position))

// const JSONValue = ({value}) => <code>{JSON.stringify(value)}</code>

// const ConsoleProps = (WrappedComponent) => (props) => {
//   console.info(WrappedComponent, props)
//   return <WrappedComponent {...props} />
// }

class Playlist extends Component {
  render = () => {
    if (!this.props.appsLoaded || !this.props.sequence)
      return <div className="alert alert-info">Loading…</div>

    const { apps, id, sequence } = this.props
    // return <JSONValue value={sequence} />
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
          apps={apps}
          items={sequence}
          editable={this.props.editable}
          remove={deletePlaylistItem.bind(null, id)}
          onSortEnd={({oldIndex, newIndex}) => movePlaylistItem(id, sequence, oldIndex, newIndex)}
          useDragHandle={true}
          axis={'y'}
          />

        {this.props.editable &&
          <ListGroupItem>
            <AddPlayListItem apps={this.props.apps} create={appendPlaylistItem.bind(null, id, sequence.length)} />
          </ListGroupItem>}
      </div>
    )
  }
}
const propMap = {
  sequence: {
    path: ({ id }) => `playlists/${id}/sequence`,
    type: Array
  }
}
export default withAppContext(connect(propMap, Playlist))

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
