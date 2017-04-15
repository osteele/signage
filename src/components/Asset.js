import { RIEInput, RIETextArea } from 'riek'
import React, { Component } from 'react'

export default class Asset extends Component {
  changedState = (state) => this.props.update(state)

  nameIsValid = (name) => name.trim().match(/./)
  urlIsValid = (url) => url.match(/^https?:\/\/.+/)

  render() {
    const { name, url } = this.props.asset
    return (
      <div>
        {this.props.editable &&
          <i className="fa fa-trash-o pull-right" aria-hidden="true" style={{cursor: 'pointer'}}
            onClick={this.props.remove} />}
        <h3>
          <RIEInput
            value={name}
            change={this.changedState}
            propName='name'
            validate={this.nameIsValid}
            classInvalid='invalid' />
        </h3>
        <a className="fa fa-external-link" href="{url}" target="_" />
        {' '}
        <RIETextArea
          value={url}
          change={this.changedState}
          propName='url'
          validate={this.urlIsValid}
          className='project-url'
          classInvalid='invalid' />
      </div>
    )
  }
}
