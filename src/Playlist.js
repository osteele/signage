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
    this.bindAsArray(FirebaseRef.child('playlist').child('sequence'), 'sequence');
  }

  renderItem(frame) {
    const app = this.state.apps[frame.app];
    return <li key={frame['.key']}>{app.name}</li>;
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

reactMixin(Playlist.prototype, ReactFireMixin);
