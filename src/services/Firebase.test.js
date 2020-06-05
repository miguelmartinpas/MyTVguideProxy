const { FirebaseService } = require('./Firebase');

jest.mock('../controllers/Preload', () => ({
    preload: {
        index: () => ({ foo: 'bar' }),
        show: (req) => ({ bar: 'foo', params: req.params }),
    },
}));

const mockSignInWithEmailAndPassword = jest.fn();
const mockVerifyIdToken = jest.fn();
const mockDocDelete = jest.fn();
const mockDocGet = jest.fn();
const mockDocSet = jest.fn();
const mockGet = jest.fn();
const mockDoc = jest.fn(() => ({
    delete: () => mockDocDelete(),
    get: () => mockDocGet(),
    set: (data) => mockDocSet(data),
}));
const mockFirebaseApp = {
    initializeApp: () => ({
        auth: () => ({
            signInWithEmailAndPassword: (user, pass) => mockSignInWithEmailAndPassword(user, pass),
        }),
    }),
    firestore: () => ({
        collection: () => ({
            get: () => mockGet(),
            doc: (day) => mockDoc(day),
        }),
    }),
};
const mockFirebaseAdmin = {
    initializeApp: jest.fn(),
    auth: () => ({
        verifyIdToken: (token) => mockVerifyIdToken(token),
    }),
    credential: {
        cert: jest.fn(),
    },
};
const mockConfig = {
    serviceAccountKey: {},
};

describe('Firebase Service', () => {
    let firebaseService = null;

    afterEach(() => {
        mockSignInWithEmailAndPassword.mockClear();
        mockVerifyIdToken.mockClear();
        mockDoc.mockClear();
        mockGet.mockClear();
        mockDocDelete.mockClear();
        mockDocGet.mockClear();
        mockDocSet.mockClear();
    });

    describe('constructor', () => {
        it('WHEN init a new instance without correct config THEN firebase will have errors', () => {
            firebaseService = new FirebaseService();
            expect(firebaseService.firebaseError).toBeDefined();
        });

        it('WHEN init a new instance without correct config THEN firebase wont have errors', () => {
            firebaseService = new FirebaseService(mockFirebaseApp, mockFirebaseAdmin, mockConfig);
            expect(firebaseService.firebaseError).toBeNull();
        });
    });

    describe('methods', () => {
        beforeEach(() => {
            firebaseService = new FirebaseService(mockFirebaseApp, mockFirebaseAdmin, mockConfig);
        });

        describe('checkWithEmailAndPassword method', () => {
            it('WHEN check auth with a correct user and pass THEN checkWithEmailAndPassword return true', async () => {
                mockSignInWithEmailAndPassword.mockImplementation(() => {
                    return {
                        user: {
                            uid: 'foo:bar',
                        },
                    };
                });
                const user = 'foo';
                const pass = 'bar';
                const response = await firebaseService.checkWithEmailAndPassword(user, pass);
                expect(response).toBeTruthy();
            });

            it('WHEN check auth with an incorrect user and pass THEN checkWithEmailAndPassword return true', async () => {
                mockSignInWithEmailAndPassword.mockImplementation(() => {
                    return {};
                });
                const user = 'foo';
                const pass = undefined;
                const response = await firebaseService.checkWithEmailAndPassword(user, pass);
                expect(response).toBeFalsy();
            });

            it('WHEN checkWithEmailAndPassword fail THEN checkWithEmailAndPassword return false', async () => {
                mockSignInWithEmailAndPassword.mockImplementation(() => {
                    throw new Error();
                });
                const user = 'foo';
                const pass = 'bar';
                const response = await firebaseService.checkWithEmailAndPassword(user, pass);
                expect(response).toBeFalsy();
            });
        });

        describe('checkAuthWithToken method', () => {
            it('WHEN check auth with a correct token THEN checkAuthWithToken return true', async () => {
                mockVerifyIdToken.mockImplementation(() => {
                    return {
                        uid: 'foo:bar',
                    };
                });
                const token = 'token';
                const response = await firebaseService.checkAuthWithToken(token);
                expect(response).toBeTruthy();
            });

            it('WHEN check auth with an incorrect token THEN checkAuthWithToken return true', async () => {
                mockVerifyIdToken.mockImplementation(() => {
                    return {};
                });
                const token = undefined;
                const response = await firebaseService.checkAuthWithToken(token);
                expect(response).toBeFalsy();
            });

            it('WHEN checkAuthWithToken fail THEN checkAuthWithToken return false', async () => {
                mockVerifyIdToken.mockImplementation(() => {
                    throw new Error();
                });
                const token = 'token';
                const response = await firebaseService.checkAuthWithToken(token);
                expect(response).toBeFalsy();
            });
        });

        describe('deletePrograms method', () => {
            it('WHEN deletePrograms works THEN deletePrograms return true', async () => {
                mockDocDelete.mockImplementation(() => {
                    return {};
                });
                const response = await firebaseService.deletePrograms('foo');
                expect(mockDoc).toHaveBeenCalledWith('foo');
                expect(mockDocDelete).toHaveBeenCalled();
                expect(response).toBeTruthy();
            });

            it('WHEN deletePrograms fail THEN deletePrograms return false', async () => {
                mockDocDelete.mockImplementation(() => {
                    throw new Error();
                });
                const response = await firebaseService.deletePrograms('bar');
                expect(mockDoc).toHaveBeenCalledWith('bar');
                expect(mockDocDelete).toHaveBeenCalled();
                expect(response).toBeFalsy();
            });
        });

        describe('purgeProgramsBeforeTo method', () => {
            it('WHEN purgeProgramsBeforeTo works THEN deletePrograms return true', async () => {
                mockDocDelete.mockImplementation(() => {
                    return {};
                });
                mockGet.mockImplementation(() => {
                    return [{ id: '2010-10-09' }, { id: '2010-10-10' }, { id: '2010-10-11' }];
                });
                const response = await firebaseService.purgeProgramsBeforeTo('2010-10-11');
                expect(mockDoc).toHaveBeenCalledWith('2010-10-09');
                expect(mockDoc).toHaveBeenCalledWith('2010-10-10');
                expect(response).toBeTruthy();
            });

            it('WHEN purgeProgramsBeforeTo fail THEN deletePrograms return false', async () => {
                mockGet.mockImplementation(() => {
                    throw new Error();
                });
                const response = await firebaseService.purgeProgramsBeforeTo('2010-10-11');
                expect(response).toBeFalsy();
            });
        });

        describe('existsProgramsFor method', () => {
            it('WHEN existsProgramsFor found a day THEN return true', async () => {
                mockDocGet.mockImplementation(() => {
                    return { exists: true };
                });
                const response = await firebaseService.existsProgramsFor('2010-10-11');
                expect(response).toBeTruthy();
            });

            it('WHEN existsProgramsFor not found a day THEN return false', async () => {
                mockDocGet.mockImplementation(() => {
                    return { exists: false };
                });
                const response = await firebaseService.existsProgramsFor('2010-10-11');
                expect(response).toBeFalsy();
            });

            it('WHEN existsProgramsFor fail THEN return false', async () => {
                mockDocGet.mockImplementation(() => {
                    throw new Error();
                });
                const response = await firebaseService.existsProgramsFor('2010-10-11');
                expect(response).toBeFalsy();
            });
        });

        describe('getExistedPrograms method', () => {
            it('WHEN getExistedPrograms has program THEN return an array with contents', async () => {
                mockGet.mockImplementation(() => {
                    return [{ foo: 'foo' }, { bar: 'bar' }];
                });
                const response = await firebaseService.getExistedPrograms('2010-10-11');
                expect(response.length).toBe(2);
            });

            it('WHEN getExistedPrograms doesn´t have program THEN return an empty array', async () => {
                mockGet.mockImplementation(() => {
                    return [];
                });
                const response = await firebaseService.getExistedPrograms('2010-10-11');
                expect(response.length).toBe(0);
            });

            it('WHEN getExistedPrograms fail THEN return an empty array', async () => {
                mockGet.mockImplementation(() => {
                    throw new Error();
                });
                const response = await firebaseService.getExistedPrograms('2010-10-11');
                expect(response.length).toBe(0);
            });
        });

        describe('getProgramsFor method', () => {
            it('WHEN getProgramsFor has program THEN return an array with contents', async () => {
                mockDocGet.mockImplementation(() => {
                    return {
                        data: () => [{ foo: 'foo' }, { bar: 'bar' }],
                    };
                });
                const response = await firebaseService.getProgramsFor('2010-10-11');
                expect(response.length).toBe(2);
            });

            it('WHEN getProgramsFor doesn´t have program THEN return an empty array', async () => {
                mockDocGet.mockImplementation(() => {
                    return {
                        data: () => [],
                    };
                });
                const response = await firebaseService.getProgramsFor('2010-10-11');
                expect(response.length).toBe(0);
            });

            it('WHEN getProgramsFor fail THEN return an empty array', async () => {
                mockDocGet.mockImplementation(() => {
                    throw new Error();
                });
                const response = await firebaseService.getProgramsFor('2010-10-11');
                expect(response.length).toBe(0);
            });
        });

        describe('writePrograms method', () => {
            it('WHEN writePrograms works THEN set functions is called', async () => {
                await firebaseService.writePrograms('day', { foo: 'bar' });
                expect(mockDoc).toHaveBeenCalledWith('day');
                expect(mockDocSet).toHaveBeenCalledWith({ foo: 'bar' });
            });

            it('WHEN writePrograms fail THEN set functions is not called', async () => {
                mockDoc.mockImplementation(() => {
                    throw new Error();
                });
                await firebaseService.writePrograms('day', { foo: 'bar' });
                expect(mockDoc).toHaveBeenCalledWith('day');
                expect(mockDocSet).not.toHaveBeenCalled();
            });
        });
    });
});
