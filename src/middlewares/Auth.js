const { firebase } = require('../services/Firebase');

class Auth {
    /* eslint-disable class-methods-use-this */
    async execute(req, res, next) {
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
    }
    /* eslint-enable class-methods-use-this */
}

module.exports = {
    authMiddleware: new Auth(),
};
