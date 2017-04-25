import React, { Component } from 'react'
import { ControlLabel, FormControl } from 'react-bootstrap'
import { Button } from 'react-bootstrap'

export default class AddAsset extends Component {
  state = { name: '', url: '' }

  handleSubmit(event) {
    event.preventDefault()
    this.props.create(this.state)
  }

  handleChange = (propName) => (e) =>
    this.setState({ [propName]: e.target.value })

  render = () =>
    <form onSubmit={this.handleSubmit.bind(this)}>
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
