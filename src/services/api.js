const fetch = require('node-fetch');

const BASE_URL = 'http://www.movistarplus.es';
const PATH = 'programacion-tv';
const VERSION = 'json';

const DATE_FORMAT = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

const fetchDate = async (day) => {
    const dateParsed = day.match(DATE_FORMAT);
    if (dateParsed) {
        return new Promise((resolve, reject) => {
            /* eslint-disable no-console */
            console.log(`call to ${BASE_URL}/${PATH}/${dateParsed[1]}?v=${VERSION}`);
            /* eslint-enable no-console */
            fetch(`${BASE_URL}/${PATH}/${dateParsed[1]}?v=${VERSION}`)
                .then((response) => response.json())
                .then((data) => {
                    resolve({ data: data.data, day: dateParsed[1] });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    throw new Error(`Error Incorrect format of date '${day}'. the correct forma is ${DATE_FORMAT}`);
};

const getCurrentDate = () => {
    const date = new Date().toISOString().match(/(.*)T.*/);
    return date[1];
};

const fetchDateForCurrentDay = async () => fetchDate(getCurrentDate());

module.exports = {
    getCurrentDate,
    fetchDate,
    fetchDateForCurrentDay,
};
