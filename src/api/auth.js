// @flow

import { Firebase, firebaseAuth, firebaseRef } from './firebase'


export const login = () => {
  const provider = new firebaseAuth.GithubAuthProvider()
  provider.addScope('user')
  // TODO on mobile, sign in without redirect
  firebaseAuth().signInWithPopup(provider).then(function(result) {
  }).catch(function(error) {
    console.error('login error', error)
    // TODO display the error
  })
}

export const logout = () => firebaseAuth().signOut()

firebaseAuth().onAuthStateChanged((user) => {
  if (user) {
    firebaseRef.child('users').child(user.uid).update({
      displayName: user.displayName,
      email: user.email,
      lastSignedInAt: Firebase.database.ServerValue.TIMESTAMP,
    })
  }
})

export const onAuthStateChanged = (onchange: () => void) =>
  firebaseAuth().onAuthStateChanged(onchange)
