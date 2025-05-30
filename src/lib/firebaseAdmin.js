import admin from "firebase-admin";

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
var serviceAccount = require("./ehealth-monitoring.json");


if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://ehealth-monitoring-98172-default-rtdb.firebaseio.com"
    });
}

export const db = admin.firestore();
