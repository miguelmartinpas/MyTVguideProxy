const cacheMiddleware = require('./caching');

describe('Preload route', () => {
    test('WHEN cache is imported THEN It is defined', () => {
        expect(cacheMiddleware).toBeDefined();
    });
});
