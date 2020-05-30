const router = require('./purge');

jest.mock('../controllers/Purge', () => ({
    purge: {
        index: () => ({ foo: 'bar' }),
        show: (req) => ({ bar: 'foo', params: req.params }),
    },
}));

describe('Purge route', () => {
    test('WHEN route is imported THEN It is defined', () => {
        expect(router).toBeDefined();
    });
});
