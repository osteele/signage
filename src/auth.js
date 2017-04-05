import { Firebase, firebaseAuth, FirebaseRef } from './firebase'

export const login = () => {
  const provider = new firebaseAuth.GithubAuthProvider()
  provider.addScope('repo')
  // TODO on mobile, sign in without redirect
  firebaseAuth().signInWithPopup(provider).then(function(result) {
    const user = result.user
    FirebaseRef.child('users').child(user.uid).set({
      email: user.email,
      signedInAt: Firebase.database.ServerValue.TIMESTAMP,
    })
  }).catch(function(error) {
    console.error('login error', error)
    // TODO display the error
  })
}

export const logout = () => firebaseAuth().signOut()

export const onAuthStateChanged = (cb) =>
  firebaseAuth().onAuthStateChanged(cb)
