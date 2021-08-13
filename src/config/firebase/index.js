import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyBzfYXYQ65ZEzsA6XAXidalcEpsS3EXyNg',
  authDomain: 'samsat-bapenda.firebaseapp.com',
  projectId: 'samsat-bapenda',
  storageBucket: 'samsat-bapenda.appspot.com',
  messagingSenderId: '817667071135',
  appId: '1:817667071135:web:0da1b52b74b41fd817d6aa',
  measurementId: 'G-75NBB5RS1J',
  databaseURL:
    'https://samsat-bapenda-default-rtdb.asia-southeast1.firebasedatabase.app/',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
