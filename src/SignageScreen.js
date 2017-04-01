import React, { Component } from 'react';
import ReactFireMixin from 'reactfire';
import reactMixin from 'react-mixin';
import { FirebaseRef } from './FirebaseClient';
import TimerMixin from 'react-timer-mixin';

export class SignageScreen extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      apps: [],
      config: {},
      playlist: {},
      index: null,
    }
    this.nextFrame = null;
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

    this.setState({index: state.index})
    const frame = state.playlist.sequence[state.index]
    if (frame) {
      const duration = frame.duration || state.playlist.duration || 60
      this.nextFrame = new Date().getTime() + duration * 1000;
    }
  }

  tick() {
    const state = this.state
    if (!state.apps.length || !state.playlist.sequence) return;
    if ((new Date()).getTime() >= this.nextFrame) {
      const index = (1 + state.index) % state.playlist.sequence.length;
      this.setState({index: index})
      this.setupFrame();
    }
  }

  render() {
    const state = this.state
    if (state.index == null || !state.config.screen) {
      return <div><h1>Loading…</h1></div>
    }
    const config = state.config;
    if (state.index > state.playlist.sequence.length) {
      return <div>invalid playlist index: {state.index}</div>
    }
    const appIndex = state.playlist.sequence[state.index];
    const app = state.apps[appIndex.app];
    if (!app) {
      return <div>invalid app index: {appIndex.app}</div>
    }
    const height = config.screen.height || '800px';
    const style = {position: "relative", height: height, width: "100%"}
    return (
      <iframe src={app.url} scrolling="no" frameBorder="0" style={style}>
        <p>Your browser does not support iframes.</p>
      </iframe>
    )
  }
}

reactMixin(SignageScreen.prototype, ReactFireMixin);
reactMixin(SignageScreen.prototype, TimerMixin);
