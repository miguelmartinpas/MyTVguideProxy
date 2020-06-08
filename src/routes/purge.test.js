const request = require('supertest');
const express = require('express');
const router = require('./purge');

jest.mock('../controllers/Purge', () => ({
    purge: {
        index: () => ({ foo: 'bar' }),
        show: (req) => ({ bar: 'foo', params: req.params }),
    },
}));

const app = express();
app.use('/mocks', router);

describe('Purge route', () => {
    it('WHEN route is imported THEN It is defined', () => {
        expect(router).toBeDefined();
    });

    it('WHEN route / THEN return 200', () => {
        request(app).get('/mock/').expect(200);
    });

    it('WHEN route /2020-10-11 THEN return 200', () => {
        request(app).get('/mock/2020-10-11').expect(200);
    });
});
