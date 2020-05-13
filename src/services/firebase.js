const firebase = require('firebase');
const admin = require('firebase-admin');
const config = require('../../config');

const firebaseApp = firebase.initializeApp(config.firebaseConfig);
admin.initializeApp({
    credential: admin.credential.cert(config.serviceAccountKey),
    databaseURL: config.serviceAccountKey.databaseURL,
});

const checkWithEmailAndPassword = async (user, pass) => {
    try {
        if (user && pass) {
            const firebaseAuth = await firebaseApp.auth().signInWithEmailAndPassword(user, pass);
            return !!firebaseAuth.user.uid;
        }
        return false;
    } catch (error) {
        return false;
    }
};

const checkAuthWithToken = async (token) => {
    try {
        if (token) {
            const decodedToken = await admin.auth().verifyIdToken(token);
            return !!decodedToken.uid;
        }
        return false;
    } catch (error) {
        return false;
    }
};

module.exports = {
    checkAuthWithToken,
    checkWithEmailAndPassword,
};
