import React from 'react';
import ReactFireMixin from 'reactfire';
import reactMixin from 'react-mixin';
import { FirebaseRef } from './FirebaseClient';

export default class Playlist extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.renderItem = this.renderItem.bind(this);
    this.state = {
      apps: [],
      sequence: [],
    }
  }

  componentDidMount() {
    this.bindAsArray(FirebaseRef.child('apps'), 'apps');
    this.bindAsArray(FirebaseRef.child('playlist/sequence'), 'sequence');
  }

  removeItem(item) {
    var firebaseRef = FirebaseRef.child('playlist/sequence');
    console.info('remove', firebaseRef, item)
    firebaseRef.child(item['.key']).remove();
  }

  renderItem(frame) {
    const app = this.state.apps[frame.app];
    return (<li key={frame['.key']}>
      <AppInfo frame={frame} app={app} remove={() => this.removeItem(frame)} />
    </li>);
  }

  render() {
    return (
      <div>
        <h2>Playlist</h2>
        <ol>
          {this.state.sequence.map(this.renderItem)}
        </ol>
      </div>
    );
  }
}

const AppInfo = ({app, frame, remove}) => (
  <span>
    {app.name}
    {frame.duration && <span> ({frame.duration} seconds)</span>}
    &nbsp;<i className="fa fa-trash-o" ariaHidden="true" onClick={remove}></i>
  </span>
)

reactMixin(Playlist.prototype, ReactFireMixin);
