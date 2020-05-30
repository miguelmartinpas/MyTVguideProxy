const { preload } = require('./Preload');

const mockPreload = jest.fn();
jest.mock('../services/Api', () => ({
    apiInstance: {
        preload: (day) => mockPreload(day),
    },
}));

const res = {
    json: (data) => data,
};

describe('Preload controller', () => {
    beforeAll(() => {
        mockPreload.mockClear();
    });

    describe('index method', () => {
        it('WHEN index is called THEN preload method is called', async () => {
            mockPreload.mockImplementation(() => ({
                foo: 'bar',
            }));
            const data = await preload.index({}, res);
            expect(mockPreload).toHaveBeenCalled();
            expect(data).toEqual({ foo: 'bar' });
        });

        it('WHEN index is called but fail THEN preload method is called and return error', async () => {
            mockPreload.mockImplementation(() => {
                throw new Error('foo');
            });

            const data = await preload.index({}, res);
            expect(mockPreload).toHaveBeenCalled();
            expect(data.error).toBeDefined();
        });
    });

    describe('show method', () => {
        it('WHEN show is called THEN preload method is called', async () => {
            mockPreload.mockImplementation(() => ({
                foo: 'bar',
            }));
            const data = await preload.show({ params: { day: 'foo-bar' } }, res);
            expect(mockPreload).toHaveBeenCalledWith('foo-bar');
            expect(data).toEqual({ foo: 'bar' });
        });

        it('WHEN show is called but fail THEN preload method is called and return error', async () => {
            mockPreload.mockImplementation(() => {
                throw new Error('foo');
            });

            const data = await preload.show({ params: { day: 'bar-foo' } }, res);
            expect(mockPreload).toHaveBeenCalled();
            expect(data.error).toBeDefined();
        });
    });
});
