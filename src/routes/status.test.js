const request = require('supertest');
const express = require('express');
const router = require('./status');

jest.mock('../controllers/Status', () => ({
    status: {
        index: () => ({ foo: 'bar' }),
        show: (req) => ({ bar: 'foo', params: req.params }),
    },
}));

const app = express();
app.use('/mocks', router);

describe('Preload route', () => {
    it('WHEN route is imported THEN It is defined', () => {
        expect(router).toBeDefined();
    });

    it('WHEN route / THEN return 200', () => {
        request(app).get('/mock/').expect(200);
    });
});
