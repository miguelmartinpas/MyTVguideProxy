const firebase = require('firebase');
require('firebase/firestore');
const admin = require('firebase-admin');
const firebaseConfig = require('../../config');

const PROGRAMS_COLLECTION = 'programs';

class Firebase {
    constructor(firebaseApp, firebaseAdmin, config) {
        this.firebaseApp = firebaseApp;
        this.firebaseAdmin = firebaseAdmin;

        try {
            this.firebaseApp = firebaseApp.initializeApp(config.firebaseConfig);
            this.firebaseAdmin.initializeApp({
                credential: this.firebaseAdmin.credential.cert(config.serviceAccountKey),
                databaseURL: config.serviceAccountKey.databaseURL,
            });
            this.db = firebaseApp.firestore();
            this.collectionRefs = this.db.collection(PROGRAMS_COLLECTION);
        } catch (error) {
            /* eslint-disable no-console */
            console.error(`FirebaseService Error: ${error.message}`);
            /* eslint-enable no-console */
        }
    }

    async checkWithEmailAndPassword(user, pass) {
        try {
            if (user && pass) {
                const firebaseAuth = await this.firebaseApp.auth().signInWithEmailAndPassword(user, pass);
                return !!firebaseAuth.user.uid;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    async checkAuthWithToken(token) {
        try {
            if (token) {
                const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
                return !!decodedToken.uid;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    async deletePrograms(day) {
        try {
            await this.collectionRefs.doc(day).delete();
            return true;
        } catch (error) {
            return false;
        }
    }

    async purgeProgramsBeforeTo(day) {
        try {
            const querySnapshot = await this.collectionRefs.get();
            querySnapshot.forEach((doc) => {
                if (new Date(day) - new Date(doc.id) > 0) {
                    this.deletePrograms(doc.id);
                }
            });
        } catch (error) {
            /* eslint-disable no-console */
            console.error('purgeProgramsBeforeTo Error', error.message);
            /* eslint-enable no-console */
        }
    }

    async existsProgramsFor(day) {
        try {
            const doc = await this.collectionRefs.doc(day).get();
            return doc.exists;
        } catch (error) {
            /* eslint-disable no-console */
            console.error('existsProgramsFor Error', error.message);
            /* eslint-enable no-console */
            return false;
        }
    }

    async getExistedPrograms() {
        const programs = [];
        try {
            const querySnapshot = await this.collectionRefs.get();
            querySnapshot.forEach((doc) => {
                programs.push(doc.id);
            });
        } catch (error) {
            /* eslint-disable no-console */
            console.error('getExistedPrograms Error', error.message);
            /* eslint-enable no-console */
        }
        return programs;
    }

    async getProgramsFor(day) {
        try {
            const doc = await this.collectionRefs.doc(day).get();
            return doc.data();
        } catch (error) {
            /* eslint-disable no-console */
            console.error('getProgramsFor Error', error.message);
            /* eslint-enable no-console */
            return [];
        }
    }

    async writePrograms(day, programs) {
        try {
            // const allowedStations = ['TVE', 'LA2', 'A3'];
            // const filteredStations = allowedStations.reduce((acc, current) => {
            //     acc[current] = programs[current];
            //     return acc;
            // }, {});
            // this.collectionRefs.doc(day).set({ ...filteredStations });
            this.collectionRefs.doc(day).set({ ...programs });
        } catch (error) {
            /* eslint-disable no-console */
            console.error('writePrograms Error', error.message);
            /* eslint-enable no-console */
        }
    }
}

module.exports = {
    firebase: new Firebase(firebase, admin, firebaseConfig),
};
