import { initializeApp } from 'firebase/app';
// import { getDatabase } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA9km85ek8ZgTuivo4w_PAog07DG_5AAJ4",
    authDomain: "ehealth-monitoring-98172.firebaseapp.com",
    databaseURL: "https://ehealth-monitoring-98172-default-rtdb.firebaseio.com",
    projectId: "ehealth-monitoring-98172",
    storageBucket: "ehealth-monitoring-98172.firebasestorage.app",
    messagingSenderId: "975638553295",
    appId: "1:975638553295:web:1cf21be00b554fd6664dba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
