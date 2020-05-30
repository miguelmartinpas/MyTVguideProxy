const ExpressCache = require('express-cache-middleware');
const cacheManager = require('cache-manager');
const config = require('../../config');

const caching = cacheManager.caching({
    store: config.globalConfig.cacheStore,
    max: config.globalConfig.cacheMax,
    ttl: config.globalConfig.cacheTtl,
});
const cacheMiddleware = new ExpressCache(caching);

module.exports = cacheMiddleware;
