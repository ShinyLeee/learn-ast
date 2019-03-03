const fs = require('fs');
const path = require('path');
const glob = require('glob');
const fuzzy = require('fuzzy');
const inquirer = require('inquirer');
const { error } = require('../log');
const transformFile = require('./transformFile');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const questions = [
  {
    name: 'inputPath',
    message: '请提供待转译代码文件路径:',
  },
  {
    name: 'visitorPath',
    message: '请提供转译代码规则文件路径:',
  },
  {
    name: 'outputPath',
    message: '请提供转译后文件放置路径:',
    validate: null,
  },
];

function getOutputPath(inputPath, outputPath) {
  if (outputPath) {
    return outputPath;
  }
  const cwd = process.cwd();
  if (typeof inputPath !== 'string') {
    return `${cwd}/outputs/${Date.now()}_index.js`;
  }
  const fileName = path.basename(inputPath);
  return `${cwd}/outputs/${Date.now()}_${fileName}`;
}

async function transformByInquirer(cmd) {
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
  const { comment } = cmd;
  const { inputPath, outputPath, visitorPath } = data;
  transformFile({
    inputPath,
    outputPath: getOutputPath(inputPath, outputPath),
    visitorPath,
    comment,
  }, () => process.exit(0));
}

function transformByArgs(cmd) {
  const {
    inputPath, outputPath, visitorPath, comment,
  } = cmd;
  const options = [inputPath, visitorPath];
  const isAllNotProvided = options.every(filePath => typeof filePath === 'undefined');
  if (isAllNotProvided) {
    cmd.outputHelp();
    process.exit(1);
  }
  const isAllProvided = options.some(filePath => typeof filePath === 'undefined');
  if (isAllProvided) {
    error(`option '-i, --input-path <inputPath>' 或
option '-s, --visitor-path <visitorPath> 未填写`);
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
  transformFile({
    inputPath,
    outputPath: getOutputPath(inputPath, outputPath),
    visitorPath,
    comment,
  }, () => process.exit(0));
}

module.exports.transformByInquirer = transformByInquirer;

module.exports.transformByArgs = transformByArgs;
