import React, { Component } from 'react';
import ReactFireMixin from 'reactfire';
import reactMixin from 'react-mixin';
import { ListGroupItem } from 'react-bootstrap';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { FirebaseRef } from './FirebaseClient';

export default class Playlist extends Component {
  firebaseSequenceRef = FirebaseRef.child('playlist/sequence');
  
  state = {
    apps: [],
    sequence: [],
  };

  componentDidMount() {
    this.bindAsArray(FirebaseRef.child('apps'), 'apps');
    this.bindAsArray(this.firebaseSequenceRef, 'sequence');
  }

  createItem = (data) => {
    this.firebaseSequenceRef.push(data);
  }

  removeItem = (item) => {
    this.firebaseSequenceRef.child(item['.key']).remove();
  }

  renderItem = (frame) => {
    const app = this.state.apps[frame.app];
    return (<li key={frame['.key']}>
      <FrameInfo frame={frame} app={app} remove={() => this.removeItem(frame)} />
    </li>);
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    arrayMove(this.state.sequence, oldIndex, newIndex).forEach((item, index) =>
      this.firebaseSequenceRef.child(item['.key']).setPriority(index)
    );

  };

  render() {
    return (
      <div>
        <PlayListSequence apps={this.state.apps} items={this.state.sequence}
          remove={this.removeItem.bind(this)}
          onSortEnd={this.onSortEnd} useDragHandle={true} axis={'y'} />
        <ListGroupItem>
          <CreateFrame apps={this.state.apps} create={this.createItem} />
        </ListGroupItem>
      </div>
    );
  }
}
reactMixin(Playlist.prototype, ReactFireMixin);

const Handle = SortableHandle(() => <div className="handle" />);

const PlayListItem = SortableElement(({item, app, remove}) => (
  <ListGroupItem key={item['.key']}>
    <Handle />
    <FrameInfo frame={item} app={app} remove={() => remove(item)} />
  </ListGroupItem>
));

const PlayListSequence = SortableContainer(({apps, items, remove}) => (
  <div>
    {items.map((item, index) =>
      <PlayListItem item={item} key={item['.key']} index={index}
        app={apps[item.app]} remove={remove} />)}
  </div>
));

const FrameInfo = ({app, frame, remove}) => (
  <span>
    {app.name}
    {frame.duration && <span> ({frame.duration} seconds)</span>}
    &nbsp;<i className="fa fa-trash-o pull-right" aria-hidden="true" style={{cursor: 'pointer'}} onClick={remove}></i>
  </span>
)

class CreateFrame extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {app: 0};
  }

  handleSubmit(event) {
    this.props.create(this.state);
    event.preventDefault();
  }

  render() {
    if (!this.props.apps.length) return null;
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <label>
          Add:
          <select defaultValue={this.props.apps[0]['.key']}
              onChange={(e) => this.setState({app: e.target.value})}>
            {this.props.apps.map((app) =>
              <option key={app['.key']} value={app['.key']}>
                {app.name}
              </option>)}
          </select>
        </label>
        <input type="submit" value="Create" />
      </form>
    );
  }
}
