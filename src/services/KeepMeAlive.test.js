const { KeepMeAliveService } = require('./KeepMeAlive');

jest.useFakeTimers();

const mockFetch = jest.fn();
jest.mock('node-fetch', () => (data) => mockFetch(data));

describe('KeepMeAliveInstance Service', () => {
    let keepMeAliveInstance = null;

    beforeEach(() => {
        keepMeAliveInstance = new KeepMeAliveService();
    });

    afterEach(() => {
        mockFetch.mockClear();
        jest.clearAllMocks();
    });

    describe('methods', () => {
        describe('getUrl method', () => {
            it('WHEN set port THEN url will get port', () => {
                const url = keepMeAliveInstance.getUrl('http', 'bar', '8080');
                expect(url).toBe('http://bar:8080/');
            });

            it('WHEN port is none THEN url won`t get port', () => {
                const url = keepMeAliveInstance.getUrl('http', 'bar', 'none');
                expect(url).toBe('http://bar/');
            });
        });

        describe('keepMeAlive method', () => {
            it('WHEN call keepMeAlive THEN fetch response with 200 and not call execute', () => {
                mockFetch.mockImplementation(async () => {
                    return Promise.resolve({
                        url: 'foo',
                        status: 200,
                        statusText: 'bar',
                    });
                });
                jest.spyOn(keepMeAliveInstance, 'execute').mockImplementation(() => {});
                keepMeAliveInstance.keepMeAlive('http', 'bar', '8081');
                expect(mockFetch).toHaveBeenCalledWith('http://bar:8081/');
                expect(keepMeAliveInstance.execute).not.toHaveBeenCalled();
            });

            it('WHEN call keepMeAlive THEN fetch response with 401 and call execute', () => {
                mockFetch.mockImplementation(async () => {
                    return Promise.resolve({
                        url: 'foo',
                        status: 401,
                        statusText: 'Unauthorized',
                    });
                });
                keepMeAliveInstance.execute = jest.fn(() => {
                    expect(keepMeAliveInstance.execute).toHaveBeenCalledWith('http', 'bar', '8081');
                });
                keepMeAliveInstance.keepMeAlive('http', 'bar', '8081');
                expect(mockFetch).toHaveBeenCalledWith('http://bar:8081/');
            });
        });

        describe('execute method', () => {
            it('WHEN run it THEN will call to keepMeAlive', () => {
                keepMeAliveInstance.keepMeAlive = jest.fn(() => {});
                keepMeAliveInstance.execute('http', 'bar', '8081');
                jest.runOnlyPendingTimers();
                expect(keepMeAliveInstance.keepMeAlive).toHaveBeenCalledWith('http', 'bar', '8081');
            });
        });
    });
});
