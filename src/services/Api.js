const fetch = require('node-fetch');
const config = require('../../config');
const stations = require('./stations.json');
const { parser } = require('./Parser');
const { firebase } = require('./Firebase');

class Api {
    constructor(url, path, query) {
        this.url = url;
        this.path = path;
        this.query = query;

        this.dateFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        this.onaDayInMilliseconds = 86400000;
        this.currentDay = new Date();
    }

    async fetchDate(day) {
        const startTime = new Date();
        const dateParsed = day.match(this.dateFormat);
        if (dateParsed) {
            const getProgramsforDay = await firebase.existsProgramsFor(day);
            if (getProgramsforDay) {
                /* eslint-disable no-console */
                console.log(`Load data from Cloud Firestore ...`);
                /* eslint-enable no-console */
                const programsFromFirebase = await firebase.getProgramsFor(day);
                firebase.purgeProgramsBeforeTo(this.getPreviousDay(day));
                return {
                    day: dateParsed[1],
                    stations,
                    programs: programsFromFirebase,
                    time: `${(new Date() - startTime) / 1000} milliseconds`,
                };
            }
            const data = await this.loadData(dateParsed[1]);
            return data;
        }
        throw new Error(`Error Incorrect format of date '${day}'. the correct forma is ${this.dateFormat}`);
    }

    async purge(day) {
        const currentDate = day || this.getCurrentDate();
        const startTime = new Date();
        try {
            /* eslint-disable no-console */
            console.log(`Purge data before to "${currentDate}" ...`);
            /* eslint-enable no-console */
            await firebase.purgeProgramsBeforeTo(currentDate);
            return { day: currentDate, purge: 'success', time: `${(new Date() - startTime) / 1000} milliseconds` };
        } catch (error) {
            /* eslint-disable no-console */
            console.error(`Purge data before to "${currentDate}" fail:`, error.message);
            /* eslint-enable no-console */
            return { day: currentDate, purge: 'error', time: `${(new Date() - startTime) / 1000} milliseconds` };
        }
    }

    async preload(day) {
        const startTime = new Date();
        const selectedDay = day || this.getCurrentDate();
        let type = 'exist';
        const getProgramsforDay = await firebase.existsProgramsFor(selectedDay);
        /* eslint-disable no-console */
        console.log(`Preload data for ${selectedDay} (${day}) ...`);
        /* eslint-enable no-console */
        if (!getProgramsforDay) {
            await this.loadData(selectedDay);
            type = 'loaded';
        }
        const programs = await firebase.getExistedPrograms();
        return { status: 'success', type, programs, time: `${(new Date() - startTime) / 1000} milliseconds` };
    }

    async loadData(day) {
        const dateParsed = day.match(this.dateFormat);
        if (dateParsed) {
            return new Promise((resolve, reject) => {
                /* eslint-disable no-console */
                console.log(`Load data from ${this.url}/${this.path}/${dateParsed[1]}${this.query} ...`);
                /* eslint-enable no-console */
                fetch(`${this.url}/${this.path}/${dateParsed[1]}${this.query}`)
                    .then((response) => response.json())
                    .then((data) => {
                        firebase.writePrograms(day, parser.parseDataToPrograms(data.data));
                        resolve({ day: dateParsed[1], stations, programs: parser.parseDataToPrograms(data.data) });
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
        return { day: dateParsed[1], stations, programs: {} };
    }

    getCurrentDate() {
        const date = this.currentDay.toISOString().match(/(.*)T.*/);
        return date[1];
    }

    getNextDay(day) {
        const date = new Date(new Date(day).getTime() + this.onaDayInMilliseconds).toISOString().match(/(.*)T.*/);
        return date[1];
    }

    getPreviousDay(day) {
        const date = new Date(new Date(day).getTime() - this.onaDayInMilliseconds).toISOString().match(/(.*)T.*/);
        return date[1];
    }

    async fetchDateForCurrentDay() {
        return this.fetchDate(this.getCurrentDate());
    }
}

const { url, path, query } = config.feedConfig;
const api = new Api(url, path, query);

module.exports = {
    api,
};
