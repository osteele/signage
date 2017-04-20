import { firebaseRef } from '../api/firebase'

const playlistItemsRef = (id) =>
  firebaseRef.child('playlists').child(id).child('sequence')

export const appendPlaylistItem = (id, position, data) =>
  playlistItemsRef(id).push({'.priority': position, ...data})

export const deletePlaylistItem = (playlist_id, item) => {
  playlistItemsRef(playlist_id).child(item['.key']).remove()
}

export const setPlaylistOrder = (id, items) =>
  items.forEach((item, position) =>
    playlistItemsRef(id).child(item['.key']).setPriority(position))
