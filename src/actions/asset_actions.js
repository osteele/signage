// @flow

import { firebaseRef } from '../api/firebase'

const firebaseAssetsRef = firebaseRef.child('assets')

type AssetKey = string

type AssetType = {|
  name: string,
  url: string
|}

type AssetUpdateType = {|
  name?: string,
  url?: string
|}

export const createAsset = (data: AssetType) =>
  firebaseAssetsRef.push(data)

export const deleteAsset = (key: AssetKey) =>
  firebaseAssetsRef.child(key).remove()

export const updateAsset = (key: AssetKey, state: AssetUpdateType) => {
  const ref = firebaseAssetsRef.child(key)
  // TODO move trim to the caller
  for (let [k, v] of Object.entries(state)) {
    ref.child(k).set(typeof v === 'string' ? v.trim() : v)
  }
}
