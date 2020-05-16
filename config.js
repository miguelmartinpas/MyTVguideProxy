let feedConfig = require('./emptyFeedConfig.json');
let firebaseConfig = require('./emptyFirebaseConfig.json');
let serviceAccountKey = require('./emptyServiceAccountKey.json');

serviceAccountKey = {
    type: process.env.FIREBASE_TYPE || serviceAccountKey.type,
    project_id: process.env.FIREBASE_PROJECT_ID || serviceAccountKey.project_id,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || serviceAccountKey.private_key_id,
    private_key: process.env.FIREBASE_PRIVATE_KEY || serviceAccountKey.private_key,
    client_email: process.env.FIREBASE_CLIENT_EMAIL || serviceAccountKey.client_email,
    client_id: process.env.FIREBASE_CLIENT_ID || serviceAccountKey.client_id,
    auth_uri: process.env.FIREBASE_AUTH_URI || serviceAccountKey.auth_uri,
    token_uri: process.env.FIREBASE_TOKEN_URI || serviceAccountKey.token_uri,
    auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || serviceAccountKey.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || serviceAccountKey.client_x509_cert_url,
};

firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY || firebaseConfig.apiKey,
    authDomain: process.env.FIREBASE_AUTHDOMAIN || firebaseConfig.authDomain,
    databaseURL: process.env.FIREBASE_DATABASEURL || firebaseConfig.databaseURL,
    projectId: process.env.FIREBASE_PROJECTID || firebaseConfig.projectId,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET || firebaseConfig.storageBucket,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID || firebaseConfig.messagingSenderId,
    appId: process.env.FIREBASE_APPID || firebaseConfig.appId,
};

feedConfig = {
    url: process.env.FEED_URL || feedConfig.url,
    path: process.env.FEED_PATH || feedConfig.path,
    query: process.env.FEED_QUERY || feedConfig.query,
};

module.exports = {
    firebaseConfig,
    serviceAccountKey,
    feedConfig,
};
