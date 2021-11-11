import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAr3w0VLZPSFr5EI5hNvlpMwVGNU2p1M2g",
  authDomain: "sidak-samsat.firebaseapp.com",
  databaseURL: "https://sidak-samsat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sidak-samsat",
  storageBucket: "sidak-samsat.appspot.com",
  messagingSenderId: "425839627630",
  appId: "1:425839627630:web:df3ddc63704af19a76857f",
  measurementId: "G-NFQX5RFW3V"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
