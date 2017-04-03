import React, { Component } from 'react';
import ReactFireMixin from 'reactfire';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { FirebaseRef } from './firebase';

export default class SignageScreen extends Component {
  state = {
    apps: [],
    config: {},
    playlist: {},
    sequence: [],
    index: null,
  };

  endFrameTime = 0;

  componentDidMount() {
    this.bindAsArray(FirebaseRef.child('apps'), 'apps');
    this.bindAsObject(FirebaseRef.child('config'), 'config');
    this.bindAsObject(FirebaseRef.child('playlist'), 'playlist');
    this.bindAsArray(FirebaseRef.child('playlist/sequence'), 'sequence');
    this.setInterval(this.tick, 1000);
  }

  _setupFrame(frame) {
    if (frame) {
      const duration = frame.duration || this.state.playlist.duration || 60;
      this.endFrameTime = new Date().getTime() + duration * 1000;
    }
  }

  tick = () => {
    const state = this.state;
    const { apps, sequence } = state;
    if (!apps.length || !sequence.length) return;
    if ((new Date()).getTime() >= this.endFrameTime) {
      const index = (1 + (state.index || 0)) % sequence.length;
      this.setState({index});
      this._setupFrame(sequence[index]);
    }
  }

  render() {
    const state = this.state;
    const { config, sequence } = state;

    if (state.index == null || !state.config.screen) {
      return <h1>Loading…</h1>;
    }

    if (state.index > sequence.length) {
      return <div className="alert alert-danger">invalid playlist index: {state.index}</div>;
    }

    const frame = sequence[state.index];
    if (!frame) {
      return <div className="alert alert-danger">invalid state index: {state.index}</div>;
    }

    const app = state.apps[frame.app];
    if (!app) {
      return <div className="alert alert-danger">invalid app index: {frame.app}</div>;
    }

    const height = config.screen.height || '800px';
    const width = config.screen.width || '100%';
    const style = {position: 'relative', height, width};
    return this.props.dummy ? (
      <AppPagePlaceholder app={app} frame={frame} style={style} />
    ): (
      <iframe src={app.url} scrolling="no" frameBorder="0" style={style}>
        <p>Your browser does not support iframes.</p>
      </iframe>
    );
  }
}
reactMixin(SignageScreen.prototype, ReactFireMixin);
reactMixin(SignageScreen.prototype, TimerMixin);

// from http://stackoverflow.com/a/15710692/220667
const hashCode = (str) =>
  [].reduce.call(str, (p, c, i, a) => (p << 5) - p + a.charCodeAt(i), 0);

function AppPagePlaceholder({app, frame, style}) {
  const h = hashCode(app.url);
  const r0 = (h >> 16) & 0xff, g0 = (h >> 8) & 0xff, b0 = h & 0xff;
  const r = 0x80 + Math.floor(r0 / 2), g = 0x80 + Math.floor(g0 / 2), b = 0x80 + Math.floor(b0 / 2);
  const background = `rgb(${r}, ${g}, ${b})`;
  const style1 = {...style, ...{background}};
  return (<div className="app-placeholder alert" style={style1}>
    <h1>
      {app.name}
      {frame.duration && <small> ({frame.duration} seconds)</small>}
    </h1>
    <div><tt>{app.url}</tt></div>
  </div>);
}
