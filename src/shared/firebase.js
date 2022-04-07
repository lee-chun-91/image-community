import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDFaqDuXUXzXxi-TqXzmI7vNITqOS5CaNk",
  authDomain: "image-community-a61f1.firebaseapp.com",
  projectId: "image-community-a61f1",
  storageBucket: "image-community-a61f1.appspot.com",
  messagingSenderId: "235190630944",
  appId: "1:235190630944:web:8cacf7ffc5619355505a45",
  measurementId: "G-LEMNPHYL7C",
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, apiKey, firestore, storage };
