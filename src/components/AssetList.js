import { ListGroup, ListGroupItem } from 'react-bootstrap'
import React, { Component } from 'react'

import AddAsset from './AddAsset'
import Asset from './Asset'
import { firebaseRef } from '../api/firebase'
import { withAssetContext } from '../providers'

const firebaseAssetsRef = firebaseRef.child('assets')

class AssetList extends Component {
  createItem = (data) =>
    firebaseAssetsRef.push({'.priority': this.props.assetKeys.length, ...data})

  removeItemByKey = (key) => {
    firebaseAssetsRef.child(key).remove()
  }

  setItemState = (key, state) => {
    const ref = firebaseAssetsRef.child(key)
    for (let [k, v] of Object.entries(state)) {
      ref.child(k).set(v.trim())
    }
  }

  render = () => {
    if (!this.props.assetsLoaded) return <div className="alert alert-info">Loading…</div>
    const { assets, assetKeys } = this.props
    const keys = assetKeys.sort((k0, k1) => {
        const n0 = assets[k0].name, n1 = assets[k1].name
        return n0.localeCompare(n1)
      })
    return (
      <ListGroup>
        {keys.map((key) =>
          <ListGroupItem key={key}>
            <Asset asset={assets[key]}
              editable={this.props.editable}
              remove={this.removeItemByKey.bind(this, key)}
              update={this.setItemState.bind(this, key)}
             />
          </ListGroupItem>
        )}
        {this.props.editable &&
            <ListGroupItem>
            <AddAsset create={this.createItem} />
          </ListGroupItem>}
      </ListGroup>
    )
  }
}
export default withAssetContext(AssetList)
