import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCYf7EVfC7k657JBKvO3UFE1gVLTtoxsxI",
    authDomain: "shoppingcart-ba7a6.firebaseapp.com",
    databaseURL: "https://shoppingcart-ba7a6-default-rtdb.firebaseio.com",
    projectId: "shoppingcart-ba7a6",
    storageBucket: "shoppingcart-ba7a6.appspot.com",
    messagingSenderId: "794863933247",
    appId: "1:794863933247:web:abc0b2e47d426328aae58a",
    measurementId: "G-HR19G8TFQ9"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage}