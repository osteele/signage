import React, { Component } from 'react'
import { ControlLabel, FormControl } from 'react-bootstrap'
import { Button } from 'react-bootstrap'

export default class AddAppItem extends Component {
  state = { name: "", url: "" }

  handleSubmit(event) {
    event.preventDefault()
    this.props.create(this.state)
  }

  handleChange = (propName) => (e) => {
    const state = { [propName]: e.target.value }
    this.setState(state)
  }

  render = () =>
    <form onSubmit={this.handleSubmit.bind(this)}>
      <ControlLabel>Add an application</ControlLabel>
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
