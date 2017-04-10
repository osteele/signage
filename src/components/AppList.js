import React, { Component } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { firebaseRef } from '../api/firebase'
import { withAppContext } from '../providers'
import AddAppItem from './AddAppItem'
import AppItem from './AppItem'

const firebaseAppsRef = firebaseRef.child('apps')

class AppList extends Component {
  createItem = (data) =>
    firebaseAppsRef.push({'.priority': this.props.appKeys.length, ...data})

  removeItemByKey = (key) => {
    firebaseAppsRef.child(key).remove()
  }

  setItemState = (key, state) => {
    const ref = firebaseAppsRef.child(key)
    for (let [k, v] of Object.entries(state)) {
      ref.child(k).set(v.trim())
    }
  }

  render = () => {
    if (!this.props.appsLoaded) return <div className="alert alert-info">Loading…</div>
    const { apps, appKeys } = this.props
    const keys = appKeys.sort((k0, k1) => {
        const n0 = apps[k0].name, n1 = apps[k1].name
        return n0.localeCompare(n1)
      })
    return (
      <ListGroup>
        {keys.map((key) =>
          <ListGroupItem key={key}>
            <AppItem app={apps[key]}
              editable={true}
              remove={this.removeItemByKey.bind(this, key)}
              update={this.setItemState.bind(this, key)}
             />
          </ListGroupItem>
        )}
        <ListGroupItem>
          <AddAppItem create={this.createItem} />
        </ListGroupItem>
      </ListGroup>
    )
  }
}
export default withAppContext(AppList)
