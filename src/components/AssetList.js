// @flow

import { ListGroup, ListGroupItem } from 'react-bootstrap'
import React from 'react'

import AddAsset from './AddAsset'
import Asset from './Asset'
import { withAssetContext } from '../providers'
import { createAsset, deleteAsset, updateAsset } from '../actions/asset_actions'

const AssetList = ({ assets, assetKeys, editable }) => {
  if (!assets) {
    return <div className="alert alert-info">Loading…</div>
  }

  const keys = assetKeys.sort((k0, k1) => {
      const n0 = assets[k0].name, n1 = assets[k1].name
      return n0.localeCompare(n1)
    })

  const render = (key) =>
    <ListGroupItem key={key}>
      <Asset asset={assets[key]}
        editable={editable}
        remove={deleteAsset.bind(null, key)}
        update={updateAsset.bind(null, key)}
       />
    </ListGroupItem>

  return (
    <ListGroup>
      {keys.map(render)}
      {editable &&
        <ListGroupItem>
          <AddAsset create={createAsset} />
        </ListGroupItem>}
    </ListGroup>
  )
}
export default withAssetContext(AssetList)
