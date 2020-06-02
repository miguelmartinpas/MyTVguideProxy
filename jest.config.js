module.exports = {
    verbose: true,
    notify: true,
    collectCoverage: true,
    coverageDirectory: 'test/results/coverage/jest',
    coverageReporters: ['html', 'text-summary', 'lcov'],
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 80,
            lines: 80,
            functions: 80,
        },
    },
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    coveragePathIgnorePatterns: ['/node_modules/', '/jest', 'config.js'],
    setupFiles: ['./jest/global.js', 'jest-date-mock'],
};
