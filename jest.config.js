module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: [
        '<rootDir>/tests/testSetup.ts'
    ]
};