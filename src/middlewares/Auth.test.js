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

jest.mock('../../config');
const config = require('../../config');

describe('Auth middleware', () => {
    beforeEach(() => {
        config.errorInConfig = false;
    });

    afterEach(() => {
        mockJson.mockClear();
        mockNext.mockClear();
        mockCheckAuthWithToken.mockClear();
        mockCheckWithEmailAndPassword.mockClear();
    });

    describe('execute method', () => {
        it('WHEN auth is imported THEN the instance is defined', () => {
            expect(auth).toBeDefined();
        });

        it('WHEN execute is used with incorrect config THEN throw error', async () => {
            config.errorInConfig = true;
            auth.execute({}, res, mockNext);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Internal error', status: 500 });
        });

        it('WHEN execute is used with correct config but incorrect header THEN throw error', async () => {
            auth.execute({}, res, mockNext);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Internal error', status: 500 });
        });

        it('WHEN execute is used with correct config header THEN return Unauthorized is auth is denied', async () => {
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

        it('WHEN execute is used with correct config header and correct param THEN nex is called', async () => {
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

        it('WHEN execute is used with correct config header and correct param THEN nex is called', async () => {
            mockCheckWithEmailAndPassword.mockImplementation(() => true);
            await auth.execute(
                {
                    headers: {
                        user: 'foo',
                        pass: 'bar',
                    },
                },
                res,
                mockNext
            );
            expect(mockCheckWithEmailAndPassword).toHaveBeenCalledWith('foo', 'bar');
            expect(mockJson).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalled();
        });

        it('WHEN execute is used with correct config header and incorrect param THEN nex is called', async () => {
            mockCheckWithEmailAndPassword.mockImplementation(() => true);
            await auth.execute(
                {
                    headers: {
                        user: 'foo',
                    },
                },
                res,
                mockNext
            );
            expect(mockCheckWithEmailAndPassword).not.toHaveBeenCalled();
            expect(mockJson).toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalled();
        });
    });
});
