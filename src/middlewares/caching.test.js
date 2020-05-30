const cacheMiddleware = require('./caching');

describe('Caching midleware', () => {
    test('WHEN cache is imported THEN It is defined', () => {
        expect(cacheMiddleware).toBeDefined();
    });
});
