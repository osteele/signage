import React, { Component } from 'react'
import { RIEInput, RIETextArea } from 'riek'

export default class AppItem extends Component {
  changedState = (state) => this.props.update(state)

  appNameIsValid = (name) => name.trim().match(/./)
  urlIsValid = (url) => url.match(/^https?:\/\/.+/)

  render() {
    const app = this.props.app
    return (
      <div>
        {this.props.editable &&
          <i className="fa fa-trash-o pull-right" aria-hidden="true" style={{cursor: 'pointer'}}
            onClick={this.props.remove} />}
        <h3>
          <RIEInput
            value={app.name}
            change={this.changedState}
            propName='name'
            validate={this.appNameIsValid}
            classInvalid='invalid' />
        </h3>
        <a className="fa fa-external-link" href="{app.url}" target="_"></a>
        {' '}
        <RIETextArea
          value={app.url}
          change={this.changedState}
          propName='url'
          validate={this.urlIsValid}
          className='project-url'
          classInvalid='invalid' />
      </div>
    )
  }
}
