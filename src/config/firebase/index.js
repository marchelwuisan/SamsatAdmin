import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCIIfh9QjNrg6fpA2yyRyID5qmRiIU9i5o",
  authDomain: "samsat-minut.firebaseapp.com",
  databaseURL: "https://samsat-minut-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "samsat-minut",
  storageBucket: "samsat-minut.appspot.com",
  messagingSenderId: "167360609396",
  appId: "1:167360609396:web:d1345e42961b90d4716521"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
