const cacheMiddleware = require('./caching');

describe('Caching midleware', () => {
    it('WHEN cache is imported THEN It is defined', () => {
        expect(cacheMiddleware).toBeDefined();
    });
});
