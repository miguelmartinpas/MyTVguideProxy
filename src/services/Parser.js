const stationKey = 'DATOS_CADENA';
const stationCode = 'CODIGO';
const programKey = 'PROGRAMAS';

class Parser {
    /* eslint-disable class-methods-use-this */
    parseStations(stations = []) {
        return stations.map((station) => {
            return {
                ref: station.code,
                title: station.name,
                station: station.station,
            };
        });
    }
    /* eslint-enable class-methods-use-this */

    /* eslint-disable class-methods-use-this */
    parsePrograms(programs = []) {
        return programs.map((program) => {
            return {
                ref: program.ELEMENTO,
                title: program.TITULO,
                category: program.GENERO,
                categoryId: program.CODIGO_GENERO,
                from: program.HORA_INICIO,
                to: program.HORA_FIN,
            };
        });
    }
    /* eslint-enable class-methods-use-this */

    parseDataToPrograms(data = {}) {
        const programs = Object.keys(data).reduce((acc, mainCode) => {
            if (data[mainCode][stationKey] && data[mainCode][stationKey][stationCode]) {
                const code = data[mainCode][stationKey][stationCode];
                acc[code] = this.parsePrograms(data[mainCode][programKey]);
            }
            return acc;
        }, {});
        return programs;
    }
}

module.exports = {
    parser: new Parser(),
    ParserService: Parser,
};
