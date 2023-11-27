//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyD1mcUHXdNpVOqNIc6a8vv8U47CSEEWKTA",
    authDomain: "comp1800bby38.firebaseapp.com",
    projectId: "comp1800bby38",
    storageBucket: "comp1800bby38.appspot.com",
    messagingSenderId: "367658223133",
    appId:"1:367658223133:web:6984749656e1e15384a8f4"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var storage = firebase.storage();