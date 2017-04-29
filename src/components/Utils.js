// @flow

import React, { Component } from 'react'
import { SortableElement, SortableHandle } from 'react-sortable-hoc'
import { ListGroupItem } from 'react-bootstrap'

export const JSONValue = ({ value }: {value: mixed}) =>
  <code>{JSON.stringify(value)}</code>

export const ConsoleProps = (WrappedComponent: any) =>
  (props: {}) => {
    console.info(WrappedComponent, props)
    return <WrappedComponent {...props} />
  }

const DragHandle = SortableHandle(() => <div className="handle" />)

export const sortableElement = (WrappedComponent: any) => SortableElement(
  (props) =>
    <ListGroupItem key={props.key}>
      {props.editable && <DragHandle />}
      <WrappedComponent {...props} />
    </ListGroupItem>
)
