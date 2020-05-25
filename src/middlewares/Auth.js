const { firebase } = require('../services/Firebase');
const config = require('../../config');

class Auth {
    /* eslint-disable class-methods-use-this */
    async execute(req, res, next) {
        try {
            if (config.errorInConfig) {
                /* eslint-disable no-console */
                console.error('Config is not setted, check it');
                /* eslint-enable no-console */
                throw new Error('Config is not setted, check it');
            }
            let isAuth = false;
            const { token, user, pass } = req.headers;
            if (token) {
                isAuth = await firebase.checkAuthWithToken(token);
            } else if (user && pass) {
                isAuth = await firebase.checkWithEmailAndPassword(user, pass);
            }
            if (!isAuth) {
                res.status(401).json({ status: 401, error: 'Unauthorized' });
            }
            next();
        } catch (error) {
            /* eslint-disable no-console */
            console.error(`Auth Error: ${error.message}`);
            /* eslint-enable no-console */
            res.status(500).json({ status: 500, error: 'Internal error' });
        }
    }
    /* eslint-enable class-methods-use-this */
}

module.exports = new Auth();
