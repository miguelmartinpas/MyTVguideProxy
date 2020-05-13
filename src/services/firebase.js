const admin = require('firebase-admin');
const config = require('../../config');

admin.initializeApp({
    credential: admin.credential.cert(config.serviceAccountKey),
    databaseURL: 'https://mytvguide-9f5ec.firebaseio.com',
});

const checkAuth = async (token) => {
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
    checkAuth,
};
