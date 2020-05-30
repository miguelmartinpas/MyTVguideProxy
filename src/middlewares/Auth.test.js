const auth = require('./Auth');

const mockJson = jest.fn((data) => data);
const res = {
    status: () => ({
        json: (data) => mockJson(data),
    }),
    json: (data) => data,
};

const mockNext = jest.fn();

const mockCheckAuthWithToken = jest.fn();
const mockCheckWithEmailAndPassword = jest.fn();
jest.mock('../services/Firebase', () => ({
    firebaseInstance: {
        checkAuthWithToken: (token) => mockCheckAuthWithToken(token),
        checkWithEmailAndPassword: (user, pass) => mockCheckWithEmailAndPassword(user, pass),
    },
}));

const mockConfig = jest.fn(() => ({
    errorInConfig: true,
}));
jest.mock('../../config', () => () => mockConfig());

describe('Auth middleware', () => {
    afterEach(() => {
        mockJson.mockClear();
        mockNext.mockClear();
        mockCheckAuthWithToken.mockClear();
        mockCheckWithEmailAndPassword.mockClear();
        mockConfig.mockClear();
    });

    describe('execute method', () => {
        it('WHEN auth is imported THEN the instance is defined', () => {
            expect(auth).toBeDefined();
        });

        it('WHEN execute is used with incorrect config THEN throw error', async () => {
            auth.execute({}, res, mockNext);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Internal error', status: 500 });
        });

        it('WHEN execute is used with correct config but incorrect header THEN throw error', async () => {
            mockConfig.mockImplementation(() => ({
                errorInConfig: false,
            }));
            auth.execute({}, res, mockNext);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Internal error', status: 500 });
        });

        it('WHEN execute is used with correct config header THEN return Unauthorized is auth is denied', async () => {
            mockConfig.mockImplementation(() => ({
                errorInConfig: false,
            }));
            mockCheckAuthWithToken.mockImplementation(() => false);
            await auth.execute(
                {
                    headers: {
                        token: 'foo',
                    },
                },
                res,
                mockNext
            );
            expect(mockCheckAuthWithToken).toHaveBeenCalledWith('foo');
            expect(mockJson).toHaveBeenCalledWith({ status: 401, error: 'Unauthorized' });
            expect(mockNext).toHaveBeenCalled();
        });

        it('WHEN execute is used with correct config header THEN nex is called', async () => {
            mockConfig.mockImplementation(() => ({
                errorInConfig: false,
            }));
            mockCheckAuthWithToken.mockImplementation(() => true);
            await auth.execute(
                {
                    headers: {
                        token: 'foo',
                    },
                },
                res,
                mockNext
            );
            expect(mockCheckAuthWithToken).toHaveBeenCalledWith('foo');
            expect(mockJson).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalled();
        });
    });
});
