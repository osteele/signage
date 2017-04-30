// @flow
import { firebaseRef } from '../api/firebase'

type ItemType = {'.key': string}
type PlaylistId = string

const playlistItemsRef = (id: PlaylistId) =>
  firebaseRef.child('playlists').child(id).child('sequence')

export const appendPlaylistItem = (id: PlaylistId, position: number, data: {}) =>
  playlistItemsRef(id).push({'.priority': position, ...data})

export const deletePlaylistItem = (id: PlaylistId, item: ItemType) =>
  playlistItemsRef(id).child(item['.key']).remove()

export const setPlaylistOrder = (id: PlaylistId, items: [ItemType]) =>
  items.forEach((item, position) =>
    playlistItemsRef(id).child(item['.key']).setPriority(position))
