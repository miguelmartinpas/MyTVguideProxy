const router = require('./status');

jest.mock('../controllers/Status', () => ({
    status: {
        index: () => ({ foo: 'bar' }),
        show: (req) => ({ bar: 'foo', params: req.params }),
    },
}));

describe('Preload route', () => {
    test('WHEN route is imported THEN It is defined', () => {
        expect(router).toBeDefined();
    });
});
