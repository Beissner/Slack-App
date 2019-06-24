import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database'; //real time database
import 'firebase/storage';  //store things like media files

var firebaseConfig = {
    apiKey: "AIzaSyDthJwDCklahjpBXir9y8pbKYkTFkkkEdw",
    authDomain: "react-slack-clone-2279e.firebaseapp.com",
    databaseURL: "https://react-slack-clone-2279e.firebaseio.com",
    projectId: "react-slack-clone-2279e",
    storageBucket: "react-slack-clone-2279e.appspot.com",
    messagingSenderId: "325803924284",
    appId: "1:325803924284:web:dd0eaa8cc7b2ab34"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;