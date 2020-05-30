const nock = require('nock');
const { advanceTo, clear } = require('jest-date-mock');
const { status } = require('./Status');

jest.useFakeTimers();

const url = 'http://foo.bar';
const path = 'bar-foo';
nock(url).persist().get(`/${path}`).query({ time: '1978-10-19T00:00:00.000Z' }).reply(200, {
    foo: 'bar',
});

const res = {
    json: (data) => data,
};

describe('Status controller', () => {
    beforeAll(() => {
        advanceTo(new Date('1978-10-19'));
    });

    afterAll(() => {
        clear();
    });

    describe('index method', () => {
        it('WHEN index is called THEN method is called', async () => {
            const data = await status.index(
                {
                    headers: {},
                },
                res
            );
            expect(data).toEqual({ status: 'ok' });
        });

        it('WHEN index is called with callback THEN method is called', async () => {
            const data = await status.index(
                {
                    headers: {
                        callback: `${url}/${path}`,
                        timeinseconds: 2,
                    },
                },
                res
            );
            expect(data).toEqual({ status: 'ok' });
            jest.runOnlyPendingTimers();
            expect(setTimeout).toHaveBeenCalledTimes(1);
        });
    });
});
