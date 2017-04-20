import { ListGroup, ListGroupItem } from 'react-bootstrap'
import React, { Component } from 'react'

import AddAsset from './AddAsset'
import Asset from './Asset'
import { withAssetContext } from '../providers'
import { createAsset, deleteAsset, updateAsset } from '../actions/asset_actions'

class AssetList extends Component {
  render = () => {
    if (!this.props.assetsLoaded) {
      return <div className="alert alert-info">Loading…</div>
    }

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
              remove={deleteAsset.bind(null, key)}
              update={updateAsset.bind(null, key)}
             />
          </ListGroupItem>
        )}
        {this.props.editable &&
            <ListGroupItem>
            <AddAsset create={createAsset} />
          </ListGroupItem>}
      </ListGroup>
    )
  }
}
export default withAssetContext(AssetList)
