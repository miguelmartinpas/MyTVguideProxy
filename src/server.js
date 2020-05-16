// https://www.airpair.com/node.js/posts/top-10-mistakes-node-developers-make
const express = require('express');
const ExpressCache = require('express-cache-middleware');
const cacheManager = require('cache-manager');
const { authMiddleware } = require('./middlewares/Auth');
const { programmes } = require('./controllers/Programmes');

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
app.use(authMiddleware.execute);

// tv-programmes
app.get('/tv-programmes', programmes.index);
app.get('/tv-programmes/:day', programmes.show);
