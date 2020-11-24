 import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDFXoT3fvV8_V1rdsBXg-4linZpRoh3plQ",
    authDomain: "instanetwork-d5366.firebaseapp.com",
    databaseURL: "https://instanetwork-d5366.firebaseio.com",
    projectId: "instanetwork-d5366",
    storageBucket: "instanetwork-d5366.appspot.com",
    messagingSenderId: "847965770896",
    appId: "1:847965770896:web:2f87527a7be8f34a69b415",
    measurementId: "G-YK89R5S038"

});

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };




