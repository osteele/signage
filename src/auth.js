import { firebaseAuth } from './firebase'

export const login = () => {
  console.info('about to log in')
  const provider = new firebaseAuth.GithubAuthProvider();
  provider.addScope('repo');
  // TODO on mobile, sign in without redirect
  firebaseAuth().signInWithPopup(provider).then(function(result) {
    const token = result.credential.accessToken;
    const user = result.user;
    console.info('logged in', token, user);
    // TODO save the token
  }).catch(function(error) {
    console.error('login error', error);
    // TODO display the error
  });
}

export const logout = () => firebaseAuth().signOut();

// export const isLoggedIn = () => firebaseAuth().currentUser;

export const onAuthStateChanged = (cb) => firebaseAuth().onAuthStateChanged(cb);
