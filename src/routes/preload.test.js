const router = require('./preload');

jest.mock('../controllers/Preload', () => ({
    preload: {
        index: () => ({ foo: 'bar' }),
        show: (req) => ({ bar: 'foo', params: req.params }),
    },
}));

describe('Preload route', () => {
    it('WHEN route is imported THEN It is defined', () => {
        expect(router).toBeDefined();
    });
});
