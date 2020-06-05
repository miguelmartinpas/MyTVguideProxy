const router = require('./programmes');

jest.mock('../controllers/Programmes', () => ({
    programmes: {
        index: () => ({ foo: 'bar' }),
        show: (req) => ({ bar: 'foo', params: req.params }),
    },
}));

describe('Programmes route', () => {
    it('WHEN route is imported THEN It is defined', () => {
        expect(router).toBeDefined();
    });
});
