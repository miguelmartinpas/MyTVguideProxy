const { purge } = require('./Purge');

const mockPurge = jest.fn();
jest.mock('../services/Api', () => ({
    apiInstance: {
        purge: (day) => mockPurge(day),
    },
}));

const res = {
    json: (data) => data,
};

describe('Purge controller', () => {
    beforeAll(() => {
        mockPurge.mockClear();
    });

    describe('index method', () => {
        it('WHEN index is called THEN method is called', async () => {
            mockPurge.mockImplementation(() => ({
                foo: 'bar',
            }));
            const data = await purge.index({}, res);
            expect(mockPurge).toHaveBeenCalled();
            expect(data).toEqual({ foo: 'bar' });
        });

        it('WHEN index is called but fail THEN method is called and return error', async () => {
            mockPurge.mockImplementation(() => {
                throw new Error('foo');
            });

            const data = await purge.index({}, res);
            expect(mockPurge).toHaveBeenCalled();
            expect(data.error).toBeDefined();
        });
    });

    describe('show method', () => {
        it('WHEN show is called THEN method is called', async () => {
            mockPurge.mockImplementation(() => ({
                foo: 'bar',
            }));
            const data = await purge.show({ params: { day: 'foo-bar' } }, res);
            expect(mockPurge).toHaveBeenCalledWith('foo-bar');
            expect(data).toEqual({ foo: 'bar' });
        });

        it('WHEN show is called but fail THEN method is called and return error', async () => {
            mockPurge.mockImplementation(() => {
                throw new Error('foo');
            });

            const data = await purge.show({ params: { day: 'bar-foo' } }, res);
            expect(mockPurge).toHaveBeenCalled();
            expect(data.error).toBeDefined();
        });
    });
});
