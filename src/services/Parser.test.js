const { parser } = require('./Parser');

describe('Parser Service', () => {
    describe('methods', () => {
        describe('parseStations method', () => {
            it('WHEN stations is empty THEN return empty array', () => {
                const data = [];
                const parserResponse = parser.parseStations(data);
                expect(parserResponse).toEqual([]);
            });
        });

        describe('parseStations method', () => {
            it('WHEN stations have data THEN return parsed stations', () => {
                const data = [
                    {
                        code: 'foo-code',
                        name: 'foo-name',
                        station: 'foo-station',
                    },
                    {
                        code: 'bar-code',
                        name: 'bar-name',
                        station: 'bar-station',
                    },
                ];
                const parserResponse = parser.parseStations(data);
                expect(parserResponse.length).toEqual(2);
                data.forEach((item, index) => {
                    expect(parserResponse[index].ref).toBeDefined();
                    expect(parserResponse[index].title).toBeDefined();
                    expect(parserResponse[index].ref).toBe(item.code);
                    expect(parserResponse[index].title).toBe(item.name);
                });
            });
        });

        describe('parsePrograms method', () => {
            it('WHEN programs have data THEN return parsed programs', () => {
                const data = [
                    {
                        ELEMENTO: 'foo',
                        TITULO: 'foo-title',
                        GENERO: 'foo-category',
                        CODIGO_GENERO: 'foo-category-ref',
                        HORA_INICIO: 'foo-from',
                        HORA_FIN: 'foo-to',
                    },
                    {
                        ELEMENTO: 'bar',
                        TITULO: 'bar-title',
                        GENERO: 'bar-category',
                        CODIGO_GENERO: 'bar-category-ref',
                        HORA_INICIO: 'bar-from',
                        HORA_FIN: 'bar-to',
                    },
                ];
                const parserResponse = parser.parsePrograms(data);
                expect(parserResponse.length).toEqual(2);
                data.forEach((item, index) => {
                    expect(parserResponse[index].ref).toBeDefined();
                    expect(parserResponse[index].title).toBeDefined();
                    expect(parserResponse[index].category).toBeDefined();
                    expect(parserResponse[index].categoryId).toBeDefined();
                    expect(parserResponse[index].from).toBeDefined();
                    expect(parserResponse[index].to).toBeDefined();
                    expect(parserResponse[index].ref).toBe(item.ELEMENTO);
                    expect(parserResponse[index].title).toBe(item.TITULO);
                    expect(parserResponse[index].category).toBe(item.GENERO);
                    expect(parserResponse[index].categoryId).toBe(item.CODIGO_GENERO);
                    expect(parserResponse[index].from).toBe(item.HORA_INICIO);
                    expect(parserResponse[index].to).toBe(item.HORA_FIN);
                });
            });
        });
    });
});
