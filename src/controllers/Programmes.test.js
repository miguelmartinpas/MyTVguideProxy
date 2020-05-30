const { programmes } = require('./Programmes');

const mockFetchDate = jest.fn();
const mockFetchDateForCurrentDay = jest.fn();
jest.mock('../services/Api', () => ({
    apiInstance: {
        fetchDateForCurrentDay: () => mockFetchDateForCurrentDay(),
        fetchDate: (day) => mockFetchDate(day),
    },
}));

const res = {
    json: (data) => data,
};

describe('Programmes controller', () => {
    beforeAll(() => {
        mockFetchDate.mockClear();
        mockFetchDateForCurrentDay.mockClear();
    });

    describe('index method', () => {
        it('WHEN index is called THEN method is called', async () => {
            mockFetchDateForCurrentDay.mockImplementation(() => ({
                foo: 'bar',
            }));
            const data = await programmes.index({}, res);
            expect(mockFetchDateForCurrentDay).toHaveBeenCalled();
            expect(data).toEqual({ foo: 'bar' });
        });

        it('WHEN index is called but fail THEN method is called and return error', async () => {
            mockFetchDateForCurrentDay.mockImplementation(() => {
                throw new Error('foo');
            });

            const data = await programmes.index({}, res);
            expect(mockFetchDateForCurrentDay).toHaveBeenCalled();
            expect(data.error).toBeDefined();
        });
    });

    describe('show method', () => {
        it('WHEN show is called THEN method is called', async () => {
            mockFetchDate.mockImplementation(() => ({
                foo: 'bar',
            }));
            const data = await programmes.show({ params: { day: 'foo-bar' } }, res);
            expect(mockFetchDate).toHaveBeenCalledWith('foo-bar');
            expect(data).toEqual({ foo: 'bar' });
        });

        it('WHEN show is called but fail THEN method is called and return error', async () => {
            mockFetchDate.mockImplementation(() => {
                throw new Error('foo');
            });

            const data = await programmes.show({ params: { day: 'bar-foo' } }, res);
            expect(mockFetchDate).toHaveBeenCalled();
            expect(data.error).toBeDefined();
        });
    });
});
