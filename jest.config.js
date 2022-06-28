module.exports = {
    verbose: false,
    silent: false,
    forceExit: true,
    testEnvironment: "node",
    globals: {
        "ts-jest": {
            tsconfig: "./tsconfig.json",
            isolatedModules: true
        }
    },
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "/.+test/.+.(test|spec).(ts|js)"
};
