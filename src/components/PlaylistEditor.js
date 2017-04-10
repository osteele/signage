import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactFireMixin from 'reactfire'
import reactMixin from 'react-mixin'
import { Button, ButtonGroup, ControlLabel, Form, FormControl, ListGroupItem } from 'react-bootstrap'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { firebaseRef } from '../api/firebase'
import { withAppContext } from '../providers'

class PlaylistEditor extends Component {
  firebaseSequenceRef = firebaseRef.child('playlist/sequence')

  state = {
    sequence: null,
  }

  componentDidMount() {
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

  render = () => {
    if (!this.props.appsLoaded || !this.state.sequence)
      return <div className="alert alert-info">Loading…</div>
    return (
      <div>
        <ButtonGroup>
          <Button title="Run in wireframe mode">
            <Link to="/preview">
              <i className="fa fa-square-o" style={{cursor: 'pointer'}} />
            </Link>
          </Button>
          <Button title="Run the playlist">
            <Link to="/display">
              <i className="fa fa-desktop" style={{cursor: 'pointer'}} />
            </Link>
          </Button>
        </ButtonGroup>
        <PlayListSequence
          apps={this.props.apps}
          items={this.state.sequence}
          editable={this.props.editable}
          remove={this.removeItem.bind(this)}
          onSortEnd={this.onSortEnd}
          useDragHandle={true} axis={'y'} />
        {this.props.editable &&
          <ListGroupItem>
            <AddPlayListItem apps={this.props.apps} create={this.createItem} />
          </ListGroupItem>}
      </div>
    )
  }
}
reactMixin(PlaylistEditor.prototype, ReactFireMixin)
export default withAppContext(PlaylistEditor)

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
