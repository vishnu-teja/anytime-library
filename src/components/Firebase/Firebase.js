import app from 'firebase/app';
import 'firebase/auth';
const config = {
  apiKey: 'AIzaSyD73mQgv3lxx0tar5gmp5o6HQZduIB0AUA',
  authDomain: 'anytime-library-cf928.firebaseapp.com',
  databaseURL: 'https://anytime-library-cf928.firebaseio.com',
  projectId: 'anytime-library-cf928',
  storageBucket: 'anytime-library-cf928.appspot.com',
  messagingSenderId: '74079132580'
};

class FireBase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.googleProvider = new app.auth.GoogleAuthProvider();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);
}

export default FireBase;
