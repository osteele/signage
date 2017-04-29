// @flow

import { RIEInput, RIETextArea } from 'riek'
import React, { Component } from 'react'

export default class Asset extends Component {
  handleChange = (state: {}) => this.props.update(state)

  nameIsValid = (name: string) => name.trim().match(/./)

  urlIsValid = (url: string) => url.match(/^https?:\/\/.+/)

  render = () =>
    <div>
      {this.props.editable &&
        <i className="fa fa-trash-o pull-right"
          aria-hidden="true"
          style={{cursor: 'pointer'}}
          onClick={this.props.remove} />}
      <h3>
        <RIEInput
          value={this.props.asset.name}
          change={this.handleChange}
          propName="name"
          validate={this.nameIsValid}
          classInvalid="invalid" />
      </h3>
      <a className="fa fa-external-link" href="{url}" target="_" />
      {' '}
      <RIETextArea
        value={this.props.asset.url}
        change={this.handleChange}
        propName="url"
        validate={this.urlIsValid}
        className="project-url"
        classInvalid="invalid" />
    </div>
}
