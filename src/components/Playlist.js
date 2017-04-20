import React, { Component } from 'react'
import { Button, ButtonGroup, ControlLabel, Form, FormControl, ListGroupItem } from 'react-bootstrap'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { Link } from 'react-router-dom'

import { connect, firebaseRef } from '../api/firebase'
import { withAssetContext } from '../providers'

const playlistItemsRef = (id) =>
  firebaseRef.child('playlists').child(id).child('sequence')

const assetendPlaylistItem = (id, position, data) =>
  playlistItemsRef(id).push({'.priority': position, ...data})

const deletePlaylistItem = (playlist_id, item) => {
  playlistItemsRef(playlist_id).child(item['.key']).remove()
}

const movePlaylistItem = (id, sequence, oldIndex, newIndex) =>
  arrayMove(sequence, oldIndex, newIndex).forEach((item, position) =>
    playlistItemsRef(id).child(item['.key']).setPriority(position))

class Playlist extends Component {
  render = () => {
    if (!this.props.assetsLoaded || !this.props.sequence)
      return <div className="alert alert-info">Loading…</div>

    const { id, sequence } = this.props
    return (
      <div>
        <ButtonGroup>
          <Button title="Run in wireframe mode">
            <Link to={`/preview/${id}`}>
              <i className="fa fa-square-o" />
            </Link>
          </Button>
          <Button title="Run the playlist">
            <Link to={`/display/${id}`}>
              <i className="fa fa-desktop" />
            </Link>
          </Button>
        </ButtonGroup>

        <PlayListSequence
          items={sequence}
          editable={this.props.editable}
          remove={deletePlaylistItem.bind(null, id)}
          onSortEnd={({oldIndex, newIndex}) => movePlaylistItem(id, sequence, oldIndex, newIndex)}
          useDragHandle={true}
          axis={'y'}
          />

        {this.props.editable &&
          <ListGroupItem>
            <AddPlayListItem assets={this.props.assets} create={assetendPlaylistItem.bind(null, id, sequence.length)} />
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
export default withAssetContext(connect(propMap, Playlist))

const DragHandle = SortableHandle(() => <div className="handle" />)

let PlayListItem = ({ item, key, assets, editable, remove }) =>
  <ListGroupItem key={key}>
    {editable && <DragHandle />}
    <span>
      {assets[item.asset_id].name}
      {item.duration && <span> ({item.duration} seconds)</span>}
      {' '}
      {editable &&
        <i className="fa fa-trash-o pull-right" aria-hidden="true" style={{cursor: 'pointer'}}
          onClick={() => remove(item)} />}
    </span>
  </ListGroupItem>
PlayListItem = SortableElement(withAssetContext(PlayListItem))

let PlayListSequence = ({ items, editable, remove }) =>
  <div>
    {items.map((item, index) =>
      <PlayListItem item={item} key={item['.key']} index={index}
        editable={editable} remove={remove} />)}
  </div>
PlayListSequence = SortableContainer(PlayListSequence)

class AddPlayListItem extends Component {
  state = { asset_id: 0 }

  handleSubmit(event) {
    event.preventDefault()
    this.props.create(this.state)
  }

  render() {
    const { assetKeys } = this.props
    return <Form inline onSubmit={this.handleSubmit.bind(this)}>
      <ControlLabel>Asset:&nbsp;</ControlLabel>
      <FormControl componentClass="select"
          defaultValue={this.props.assets[0]['.key']}
          onChange={(e) => this.setState({asset_id: e.target.value})}>
        {assetKeys.map((key) =>
          <option key={key} value={key}>
            {this.props.assets[key].name}
          </option>)}
      </FormControl>
      <Button type="submit" bsSize="small" className="pull-right">Add</Button>
    </Form>
  }
}
AddPlayListItem = withAssetContext(AddPlayListItem)
