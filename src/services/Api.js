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
    }

    async fetchDate(day) {
        const dateParsed = day.match(this.dateFormat);
        if (dateParsed) {
            const getProgramsforDay = await firebase.existsProgramsFor(day);
            if (getProgramsforDay) {
                /* eslint-disable no-console */
                console.log(`call to Cloud Firestore ...`);
                /* eslint-enable no-console */
                const programsFromFirebase = await firebase.getProgramsFor(day);
                firebase.purgeProgramsBeforeTo(day);
                return { day: dateParsed[1], stations, programs: programsFromFirebase };
            }
            return new Promise((resolve, reject) => {
                /* eslint-disable no-console */
                console.log(`call to ${this.url}/${this.path}/${dateParsed[1]}${this.query} ...`);
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
        throw new Error(`Error Incorrect format of date '${day}'. the correct forma is ${this.dateFormat}`);
    }

    /* eslint-disable class-methods-use-this */
    getCurrentDate() {
        const date = new Date().toISOString().match(/(.*)T.*/);
        return date[1];
    }
    /* eslint-enable class-methods-use-this */

    /* eslint-disable class-methods-use-this */
    getNextDay(day) {
        const date = new Date(new Date(day).getTime() + 86400000).toISOString().match(/(.*)T.*/);
        return date[1];
    }
    /* eslint-enable class-methods-use-this */

    async fetchDateForCurrentDay() {
        return this.fetchDate(this.getCurrentDate());
    }
}

const { url, path, query } = config.feedConfig;
const api = new Api(url, path, query);

module.exports = {
    api,
};
