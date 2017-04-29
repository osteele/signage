// @flow

import React, { Component } from 'react'
import { ControlLabel, FormControl } from 'react-bootstrap'
import { Button } from 'react-bootstrap'

export default class AddAsset extends Component {
  state = { name: '', url: '' }

  handleSubmit = (e: SyntheticInputEvent) => {
    e.preventDefault()
    this.props.create(this.state)
  }

  handleChange = (propName: string) => (e: SyntheticInputEvent) =>
    this.setState({ [propName]: e.target.value })

  render = () =>
    <form onSubmit={this.handleSubmit}>
      <ControlLabel>Add an asset</ControlLabel>
      <FormControl type="text"
        placeholder="name"
        onChange={this.handleChange('name')} />
      <FormControl type="text"
        placeholder="URL"
        className="project-url"
        onChange={this.handleChange('url')} />
      <FormControl.Feedback />
      <Button type="submit">Create</Button>
    </form>
}
