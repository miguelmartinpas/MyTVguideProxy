let feedConfig = require('./config/emptyFeedConfig.json');
let firebaseConfig = require('./config/emptyFirebaseConfig.json');
let serviceAccountKey = require('./config/emptyServiceAccountKey.json');
let hostConfig = require('./config/emptyHostConfig.json');

let errorInConfig = false;

serviceAccountKey = {
    type: process.env.FIREBASE_TYPE || serviceAccountKey.type,
    project_id: process.env.FIREBASE_PROJECT_ID || serviceAccountKey.project_id,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || serviceAccountKey.private_key_id,
    private_key: (process.env.FIREBASE_PRIVATE_KEY || serviceAccountKey.private_key || '').replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL || serviceAccountKey.client_email,
    client_id: process.env.FIREBASE_CLIENT_ID || serviceAccountKey.client_id,
    auth_uri: process.env.FIREBASE_AUTH_URI || serviceAccountKey.auth_uri,
    token_uri: process.env.FIREBASE_TOKEN_URI || serviceAccountKey.token_uri,
    auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || serviceAccountKey.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || serviceAccountKey.client_x509_cert_url,
};

Object.keys(serviceAccountKey)
    .filter((key) => !serviceAccountKey[key])
    .forEach((key) => {
        errorInConfig = true;
        /* eslint-disable no-console */
        console.log(`config > serviceAccountKey > ${key} is emty`);
        /* eslint-enable no-console */
    });

firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY || firebaseConfig.apiKey,
    authDomain: process.env.FIREBASE_AUTHDOMAIN || firebaseConfig.authDomain,
    databaseURL: process.env.FIREBASE_DATABASEURL || firebaseConfig.databaseURL,
    projectId: process.env.FIREBASE_PROJECTID || firebaseConfig.projectId,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET || firebaseConfig.storageBucket,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID || firebaseConfig.messagingSenderId,
    appId: process.env.FIREBASE_APPID || firebaseConfig.appId,
};

Object.keys(firebaseConfig)
    .filter((key) => !firebaseConfig[key])
    .forEach((key) => {
        errorInConfig = true;
        /* eslint-disable no-console */
        console.log(`config > firebaseConfig > ${key} is emty`);
        /* eslint-enable no-console */
    });

feedConfig = {
    url: process.env.FEED_URL || feedConfig.url,
    path: process.env.FEED_PATH || feedConfig.path,
    query: process.env.FEED_QUERY || feedConfig.query,
};

Object.keys(feedConfig)
    .filter((key) => !feedConfig[key])
    .forEach((key) => {
        errorInConfig = true;
        /* eslint-disable no-console */
        console.log(`config > feedConfig > ${key} is emty`);
        /* eslint-enable no-console */
    });

hostConfig = {
    mode: process.env.HOST_MODE || hostConfig.mode,
    host: process.env.HOST_URL || hostConfig.url,
    port: process.env.HOST_PORT || hostConfig.port,
};

Object.keys(hostConfig)
    .filter((key) => !hostConfig[key])
    .forEach((key) => {
        errorInConfig = true;
        /* eslint-disable no-console */
        console.log(`config > hostConfig > ${key} is emty`);
        /* eslint-enable no-console */
    });

const globalConfig = {
    useKeepMeAlive: process.env.USE_KEEP_ME_ALIVE || false,
    port: process.env.PORT || 3000,
};

module.exports = {
    firebaseConfig,
    serviceAccountKey,
    feedConfig,
    hostConfig,
    globalConfig,
    errorInConfig,
};
