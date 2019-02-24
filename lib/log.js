const chalk = require('chalk');

const { log } = console;

module.exports = log;

module.exports.info = str => log(chalk.blue('Info'), str);
module.exports.success = str => log(chalk.green('Success'), str);
module.exports.warning = str => log(chalk.yellow('Warning'), str);
module.exports.error = str => log(chalk.red('Error'), str);
