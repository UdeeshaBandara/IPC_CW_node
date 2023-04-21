const {getFirestore} = require("firebase/firestore/lite");
const {initializeApp} = require("firebase/app");
const dotenv = require('dotenv')
dotenv.config()

const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
};

const firebase = initializeApp(firebaseConfig);
firestore = getFirestore(firebase);

module.exports = firestore;
