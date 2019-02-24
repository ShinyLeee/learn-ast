module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "import/no-extraneous-dependencies": 0,
        "import/no-dynamic-require": 0,
        "no-param-reassign": 0,
        "global-require": 0,
        "no-console": 0
    }
};