// https://www.airpair.com/node.js/posts/top-10-mistakes-node-developers-make
const express = require('express');
const ExpressCache = require('express-cache-middleware');
const cacheManager = require('cache-manager');
const { checkAuth } = require('./services/firebase');
const broadcasting = require('./controllers/broadcasting');

const PORT = process.env.PORT || 3000;

const caching = cacheManager.caching({
    store: 'memory',
    max: 10000,
    ttl: 3600,
});
const cacheMiddleware = new ExpressCache(caching);

const app = express();
cacheMiddleware.attach(app);

app.listen(PORT, () => {
    /* eslint-disable no-console */
    console.info('Server started in port 3000');
    /* eslint-enable no-console */
});

// mildeware to check auth
app.use(async (req, res, next) => {
    const isAuth = await checkAuth(req.query.token, req.query.user, req.query.pass);
    if (!isAuth) {
        res.status(401).json({ status: 401, error: 'Unauthorized' });
    }
    next();
});

// broadcasting

app.get('/broadcasting', async (req, res) => {
    res.json(await broadcasting.index());
});

app.get('/broadcasting/:day', async (req, res) => {
    res.json(await broadcasting.show(req.params.day));
});
