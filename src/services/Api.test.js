const { advanceTo, clear } = require('jest-date-mock');
const nock = require('nock');
const { ApiService } = require('./Api');

const mockExistsProgramsFor = jest.fn();
const mockProgramsFromFirebase = jest.fn();
const mockPurgeProgramsBeforeTo = jest.fn();
const mockWritePrograms = jest.fn();
const mockGetExistedPrograms = jest.fn();
const mockGetProgramsFor = jest.fn();
jest.mock('./Firebase', () => ({
    firebaseInstance: {
        existsProgramsFor: () => mockExistsProgramsFor(),
        programsFromFirebase: () => mockProgramsFromFirebase(),
        purgeProgramsBeforeTo: () => mockPurgeProgramsBeforeTo(),
        writePrograms: () => mockWritePrograms(),
        getExistedPrograms: () => mockGetExistedPrograms(),
        getProgramsFor: () => mockGetProgramsFor(),
    },
}));

const mockParseDataToPrograms = jest.fn();
jest.mock('./Parser', () => ({
    parser: {
        parseDataToPrograms: () => mockParseDataToPrograms(),
    },
}));

const url = 'http://my-api-proxy.com';
const path = 'path';
const query = '';
nock(url).persist().get(`/${path}`).reply(200, {
    foo: 'bar',
});
new Array(19).fill(undefined).forEach((item, index) => {
    nock(url)
        .persist()
        .get(`/${path}/1978-10-${index + 10}`)
        .reply(200, {
            foo: `bar-1978-10-${index + 10}`,
        });
});

const pathError = 'path-error';
nock(url).persist().get(`/${pathError}`).replyWithError({
    message: 'foo-message',
    code: 'foo',
});
new Array(19).fill(undefined).forEach((item, index) => {
    nock(url)
        .persist()
        .get(`/${pathError}/1964-03-${index + 10}`)
        .reply(200, {
            foo: `bar-1964-03-${index + 10}`,
        });
});

let apiInstance = null;

describe('Api Service', () => {
    beforeAll(() => {
        advanceTo(new Date('1978-10-19'));
    });

    afterAll(() => {
        clear();
    });

    beforeEach(() => {
        apiInstance = new ApiService(url, path, query);
    });

    afterEach(() => {
        mockExistsProgramsFor.mockClear();
        mockProgramsFromFirebase.mockClear();
        mockPurgeProgramsBeforeTo.mockClear();
        mockWritePrograms.mockClear();
        mockParseDataToPrograms.mockClear();
        mockGetExistedPrograms.mockClear();
        mockGetProgramsFor.mockClear();
    });

    describe('getCurrentDate method', () => {
        it('WHEN get the current date THEN current date should be equal to mock date', () => {
            const getCurrentDate = apiInstance.getCurrentDate();
            expect(getCurrentDate).toBe('1978-10-19');
        });
    });

    describe('getNextDay method', () => {
        it('WHEN get the next day THEN date should be equal to mock date + one day', () => {
            const getNextDate = apiInstance.getNextDay('1992-02-15');
            expect(getNextDate).toBe('1992-02-16');
        });
    });

    describe('getPreviousDay method', () => {
        it('WHEN get the previous day THEN date should be equal to mock date + one day', () => {
            const getPreviousDate = apiInstance.getPreviousDay('1989-10-12');
            expect(getPreviousDate).toBe('1989-10-11');
        });
    });

    describe('isValidDate method', () => {
        it('WHEN validate empty value THEN it should return false', () => {
            expect(apiInstance.isValidDate()).toBeFalsy();
        });
        it('WHEN validate undefined value THEN it should return false ', () => {
            expect(apiInstance.isValidDate(undefined)).toBeFalsy();
        });
        it('WHEN validate a string THEN it should return false', () => {
            expect(apiInstance.isValidDate('a')).toBeFalsy();
        });
        it('WHEN validate a correct date string THEN it should return true', () => {
            expect(apiInstance.isValidDate('2020-02-02')).toBeTruthy();
        });
        it('WHEN validate a incorrect date string THEN it should return false', () => {
            expect(apiInstance.isValidDate('2020-22-02')).toBeFalsy();
        });
    });

    describe('loadData method', () => {
        it('WHEN loadData without day THEN return empty object', async () => {
            const data = await apiInstance.loadData();
            expect(data.day).toBe(undefined);
            expect(data.programs).toEqual({});
            expect(data.stations).toEqual({});
        });

        it('WHEN loadData with incorrect day THEN return empty object', async () => {
            const data = await apiInstance.loadData('2020-18-42');
            expect(data.day).toBe('2020-18-42');
            expect(data.programs).toEqual({});
            expect(data.stations).toEqual({});
        });

        it('WHEN loadData with correct day THEN mockWritePrograms is called', async () => {
            const data = await apiInstance.loadData('1978-10-16');
            expect(mockParseDataToPrograms).toHaveBeenCalled();
            expect(mockWritePrograms).toHaveBeenCalled();
            expect(data.day).toBe('1978-10-16');
        });

        it('WHEN loadData throw error THEN mockWritePrograms is not called', async () => {
            apiInstance = new ApiService(url, pathError, query);
            try {
                await apiInstance.loadData('1964-03-29');
            } catch (error) {
                expect(mockParseDataToPrograms).not.toHaveBeenCalled();
                expect(mockWritePrograms).not.toHaveBeenCalled();
            }
        });
    });

    describe('preload method', () => {
        it('WHEN preload without day and without cache THEN try to load current day from server', async () => {
            const data = await apiInstance.preload();
            expect(mockExistsProgramsFor).toHaveBeenCalled();
            expect(mockGetExistedPrograms).toHaveBeenCalled();
            expect(data.type).toBe('loaded');
        });

        it('WHEN preload with day and cache THEN try to load that day from cache', async () => {
            mockExistsProgramsFor.mockImplementation(() => true);
            const data = await apiInstance.preload('1978-10-20');
            expect(mockExistsProgramsFor).toHaveBeenCalled();
            expect(mockGetExistedPrograms).toHaveBeenCalled();
            expect(data.type).toBe('exist');
        });
    });

    describe('purge method', () => {
        it('WHEN purge without day THEN try to purgefrom current day and return success', async () => {
            const data = await apiInstance.purge();
            expect(mockPurgeProgramsBeforeTo).toHaveBeenCalled();
            expect(data.purge).toBe('success');
        });

        it('WHEN purge with day and fail cache THEN return error on purge', async () => {
            mockPurgeProgramsBeforeTo.mockImplementation(() => {
                throw new Error();
            });
            const data = await apiInstance.purge('1978-10-20');
            expect(mockPurgeProgramsBeforeTo).toHaveBeenCalled();
            expect(data.purge).toBe('error');
        });
    });

    describe('fetchDate method', () => {
        it('WHEN fetchDate without day THEN try to purgefrom current day and return success', async () => {
            try {
                await apiInstance.fetchDate();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        it('WHEN fetch a correct date without cache THEN load data', async () => {
            mockExistsProgramsFor.mockImplementation(() => false);
            mockWritePrograms.mockImplementation(() => ({
                foo: 'bar',
            }));
            const data = await apiInstance.fetchDate('1978-10-20');
            expect(mockExistsProgramsFor).toHaveBeenCalled();
            expect(mockWritePrograms).toHaveBeenCalled();
            expect(data.day).toBe('1978-10-20');
        });

        it('WHEN fetch a correct date with cache THEN load data from cache', async () => {
            mockExistsProgramsFor.mockImplementation(() => true);
            mockPurgeProgramsBeforeTo.mockImplementation(() => {
                return true;
            });
            mockGetProgramsFor.mockImplementation(() => ({
                bar: 'foo',
            }));
            const data = await apiInstance.fetchDate('1978-10-20');
            expect(mockExistsProgramsFor).toHaveBeenCalled();
            expect(mockGetProgramsFor).toHaveBeenCalled();
            expect(mockWritePrograms).not.toHaveBeenCalled();
            expect(data.day).toBe('1978-10-20');
        });
    });

    describe('fetchDateForCurrentDay method', () => {
        it('WHEN fetchDateForCurrentDay without day THEN try to purgefrom current day and return success', async () => {
            try {
                await apiInstance.fetchDateForCurrentDay();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });
});
