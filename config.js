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

console.log('process.env', process.env);
console.log('serviceAccountKey', serviceAccountKey);

module.exports = {
    serviceAccountKey,
};
