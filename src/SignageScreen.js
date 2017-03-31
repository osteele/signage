import React, { Component } from 'react';
import ReactFireMixin from 'reactfire';
import reactMixin from 'react-mixin';
import { FirebaseRef } from './FirebaseClient';

export class SignageScreen extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      apps: [],
      config: {}
    }
  }

  componentDidMount() {
    this.bindAsArray(FirebaseRef.child('apps'), 'apps');
    this.bindAsObject(FirebaseRef.child('config'), 'config');
  }

  render() {
    const config = this.state.config;
    const index = config.index || 0;
    const app = this.state.apps[index];
    if (!app) {
      return (<div><h1>Loading…</h1></div>);
    }
    const height = config.screen.height || '800px';
    const style = {position: "relative", height: height, width: "100%"}
    return (
      <iframe src={app.url} scrolling="no" frameborder="0" style={style}>
        <p>Your browser does not support iframes.</p>
      </iframe>
    )
  }
}

reactMixin(SignageScreen.prototype, ReactFireMixin);
