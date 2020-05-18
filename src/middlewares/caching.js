const ExpressCache = require('express-cache-middleware');
const cacheManager = require('cache-manager');

const caching = cacheManager.caching({
    store: 'memory',
    max: 10000,
    ttl: 3600,
});
const cacheMiddleware = new ExpressCache(caching);

module.exports = {
    cacheMiddleware,
};
