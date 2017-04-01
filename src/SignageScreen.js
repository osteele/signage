import React from 'react';
import ReactFireMixin from 'reactfire';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { FirebaseRef } from './FirebaseClient';

export class SignageScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      apps: [],
      config: {},
      playlist: {},
      index: null,
    };
    this.endFrameTime = 0;
  }

  componentDidMount() {
    this.bindAsArray(FirebaseRef.child('apps'), 'apps');
    this.bindAsObject(FirebaseRef.child('playlist'), 'playlist');
    this.bindAsObject(FirebaseRef.child('config'), 'config');
    this.setInterval(this.tick, 1000);
  }

  setupFrame() {
    const state = this.state
    if (!state.apps.length || !state.playlist.sequence.length) return;
    if (state.index > state.playlist.sequence.length) {
      this.setState({index: 0})
    }

    this.setState({index: state.index});
    const frame = state.playlist.sequence[state.index];
    if (frame) {
      const duration = frame.duration || state.playlist.duration || 60;
      this.endFrameTime = new Date().getTime() + duration * 1000;
    }
  }

  tick() {
    const state = this.state;
    if (!state.apps.length || !state.playlist.sequence) return;
    if ((new Date()).getTime() >= this.endFrameTime) {
      const index = (1 + state.index) % state.playlist.sequence.length;
      this.setState({index});
      this.setupFrame();
    }
  }

  render() {
    const state = this.state
    if (state.index == null || !state.config.screen) {
      return <div><h1>Loading…</h1></div>;
    }

    const config = state.config;
    if (state.index > state.playlist.sequence.length) {
      return <div class="error">invalid playlist index: {state.index}</div>;
    }

    const frame = state.playlist.sequence[state.index];
    const app = state.apps[frame.app];
    if (!app) {
      return <div class="error">invalid app index: {frame.app}</div>;
    }

    const height = config.screen.height || '800px';
    const width = config.screen.width || '100%';
    const style = {position: 'relative', height, width};
    return this.props.dummy ? (
      <DummyApp app={app} style={style} />
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

function DummyApp({app, style}) {
  const h = hashCode(app.url);
  const r0 = (h >> 16) & 0xff, g0 = (h >> 8) & 0xff, b0 = h & 0xff;
  const r = 0x80 + Math.floor(r0 / 2), g = 0x80 + Math.floor(g0 / 2), b = 0x80 + Math.floor(b0 / 2);
  const background = `rgb(${r}, ${g}, ${b})`;
  const style1 = {...style, ...{background}};
  return <div className="dummy-iframe" style={style1}><tt>{app.url}</tt></div>;
}
