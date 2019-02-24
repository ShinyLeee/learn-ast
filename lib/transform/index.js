const fs = require('fs');
const glob = require('glob');
const fuzzy = require('fuzzy');
const inquirer = require('inquirer');
const { error } = require('../log');
const transformFile = require('./transformFile');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const questions = [
  {
    name: 'inputFile',
    message: '请提供待转译代码文件路径:',
  },
  {
    name: 'scriptFile',
    message: '请提供转译代码规则文件路径:',
  },
  {
    name: 'outputFile',
    message: '请提供转译后文件放置路径:',
    validate: null,
  },
];

async function transformByInquirer() {
  const data = await inquirer.prompt(questions.map(d => ({
    type: 'autocomplete',
    suggestOnly: true,
    pageSize: 4,
    source: (answers, input = '') => new Promise((resolve) => {
      const curFiles = glob.sync('*');
      const searchFiles = input ? glob.sync(`${input}*`) : [];
      const results = fuzzy.filter(input, curFiles.concat(searchFiles));
      resolve(results.map(r => r.original));
    }),
    validate: (filePath) => {
      const isExist = fs.existsSync(filePath);
      return isExist || `找不到文件路径: '${filePath}'`;
    },
    ...d,
  })));

  const { inputFile, outputFile, scriptFile } = data;
  transformFile(
    inputFile,
    outputFile || './outputs/index.js',
    scriptFile,
    () => process.exit(0),
  );
}

function transformByArgs(cmd) {
  const { inputFile, outputFile, scriptFile } = cmd;
  const options = [inputFile, scriptFile];
  const isAllNotProvided = options.every(filePath => typeof filePath === 'undefined');
  if (isAllNotProvided) {
    cmd.outputHelp();
    process.exit(1);
  }
  const isAllProvided = options.some(filePath => typeof filePath === 'undefined');
  if (isAllProvided) {
    error(`option '-i, --input-file <inputFile>' 或
option '-s, --script-file <scriptFile> 未填写`);
    process.exit(1);
  }
  options.forEach((filePath) => {
    const ret = fs.existsSync(filePath);
    if (!ret) {
      error(`找不到文件路径: '${filePath}'`);
      process.exit(1);
    }
    return ret;
  });
  transformFile(
    inputFile,
    outputFile,
    scriptFile,
    () => process.exit(0),
  );
}

module.exports.transformByInquirer = transformByInquirer;

module.exports.transformByArgs = transformByArgs;
