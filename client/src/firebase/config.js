import firebase from "firebase/compat/app";
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCiaLMTAWTUamXndojGs7y5SLMEiTE9cng",
    authDomain: "socialmedia-50590.firebaseapp.com",
    projectId: "socialmedia-50590",
    storageBucket: "socialmedia-50590.appspot.com",
    messagingSenderId: "266229382460",
    appId: "1:266229382460:web:939d891c8a17828f9b3239",
    measurementId: "G-K3ZMCEES0H"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export default storage;