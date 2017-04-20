import React, { Component } from 'react'

const JSONValue = ({value}) => <code>{JSON.stringify(value)}</code>

const ConsoleProps = (WrappedComponent) => (props) => {
  console.info(WrappedComponent, props)
  return <WrappedComponent {...props} />
}
