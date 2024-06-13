// firebase.js

import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyANnT57uQ4lH8bvhxOctMkgM3D9Kr4Ev9Q",
    authDomain: "app-100-6f705.firebaseapp.com",
    databaseURL: "https://app-100-6f705-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "app-100-6f705",
    storageBucket: "app-100-6f705.appspot.com",
    messagingSenderId: "883005554199",
    appId: "1:883005554199:web:68c42d5f89a69f496ea652"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

export { auth, firebaseApp};
