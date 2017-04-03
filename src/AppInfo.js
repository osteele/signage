import React, { Component } from 'react';
import ReactFireMixin from 'reactfire';
import reactMixin from 'react-mixin';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { FirebaseRef } from './firebase';

export default class AppInfoList extends Component {
  state = {
    apps: []
  };

  componentDidMount() {
    this.bindAsArray(FirebaseRef.child('apps'), 'apps');
  }

  renderItem(app) {
    return <ListGroupItem key={app['.key']}>
      <h3>{app.name}</h3>
      <a href="{app.url}" target="_"><code>{app.url}</code></a></ListGroupItem>
  }

  render() {
    return (
      <ListGroup>
        {this.state.apps.map(this.renderItem)}
      </ListGroup>
    )
  }
}

reactMixin(AppInfoList.prototype, ReactFireMixin);
