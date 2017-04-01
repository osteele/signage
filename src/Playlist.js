import React from 'react';
import ReactFireMixin from 'reactfire';
import reactMixin from 'react-mixin';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {FirebaseRef} from './FirebaseClient';

export default class Playlist extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.firebaseSequenceRef = FirebaseRef.child('playlist/sequence');
    this.state = {
      apps: [],
      sequence: [],
    };
    this.createItem = this.createItem.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.bindAsArray(FirebaseRef.child('apps'), 'apps');
    this.bindAsArray(this.firebaseSequenceRef, 'sequence');
  }

  createItem(data) {
    this.firebaseSequenceRef.push(data);
  }

  removeItem(item) {
    this.firebaseSequenceRef.child(item['.key']).remove();
  }

  renderItem(frame) {
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
        <h2>Playlist</h2>
        <PlayListSequence apps={this.state.apps} items={this.state.sequence}
          remove={this.removeItem.bind(this)} onSortEnd={this.onSortEnd} />
        <CreateFrame apps={this.state.apps} create={this.createItem} />
      </div>
    );
  }
}
reactMixin(Playlist.prototype, ReactFireMixin);

const PlayListItem = SortableElement(({item, app, remove}) => (
  <li key={item['.key']}>
    <FrameInfo frame={item} app={app} remove={() => remove(item)} />
  </li>
));

const PlayListSequence = SortableContainer(({apps, items, remove}) => (<ul>
  {items.map((item, index) => {
    const app = apps[item.app];
    return <PlayListItem item={item} key={item['.key']} index={index}
      app={app} remove={remove} />;
  })}
</ul>));

const FrameInfo = ({app, frame, remove}) => (
  <span>
    {app.name}
    {frame.duration && <span> ({frame.duration} seconds)</span>}
    &nbsp;<i className="fa fa-trash-o" aria-hidden="true" style={{cursor: 'pointer'}} onClick={remove}></i>
  </span>
)

class CreateFrame extends React.Component {
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
          Application:
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
