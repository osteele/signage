import { firebaseRef } from '../api/firebase'

const firebaseAssetsRef = firebaseRef.child('assets')

export const createAsset = (data) =>
  firebaseAssetsRef.push(data)

export const deleteAsset = (key) => {
  firebaseAssetsRef.child(key).remove()
}

export const updateAsset = (key, state) => {
  const ref = firebaseAssetsRef.child(key)
  for (let [k, v] of Object.entries(state)) {
    ref.child(k).set(v.trim())
  }
}
