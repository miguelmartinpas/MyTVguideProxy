const firebase = require('firebase');
const admin = require('firebase-admin');
const config = require('../../config');

admin.initializeApp({
    credential: admin.credential.cert(config.serviceAccountKey),
    databaseURL: 'https://mytvguide-9f5ec.firebaseio.com',
});
const firebaseApp = firebase.initializeApp(config.firebaseConfig);

const checkAuth = async (token, user, pass) => {
    try {
        if (token && user && pass) {
            await firebaseApp.auth().signInWithEmailAndPassword(user, pass);
            const idToken = await firebaseApp.auth().currentUser.getIdToken();
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            return !!decodedToken.uid;
        }
        return false;
    } catch (error) {
        return false;
    }
};

module.exports = {
    checkAuth,
};
