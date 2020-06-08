const request = require('supertest');
const express = require('express');
const router = require('./preload');

jest.mock('../controllers/Preload', () => ({
    preload: {
        index: () => ({ foo: 'bar' }),
        show: (req) => ({ bar: 'foo', params: req.params }),
    },
}));

const app = express();
app.use('/mock', router);

describe('Preload route', () => {
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
