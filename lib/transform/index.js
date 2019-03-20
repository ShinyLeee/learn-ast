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

function getOutputPath(inputPath, outputPath, surfix) {
  if (outputPath) {
    return outputPath;
  }
  const cwd = process.cwd();
  if (typeof inputPath !== 'string') {
    return `${cwd}/outputs/${Date.now()}_index.js`;
  }
  let fileName;
  const [name, ext] = path.basename(inputPath).split('.');
  const now = Date.now();
  if (surfix) {
    fileName = `${name}_${now}_${surfix}.${ext}`;
  } else {
    fileName = `${name}_${now}.${ext}`;
  }
  return `${cwd}/outputs/${fileName}`;
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
  const { comment, parser } = cmd;
  const { inputPath, outputPath, visitorPath } = data;
  await transformFile({
    inputPath,
    outputPath: getOutputPath(inputPath, outputPath, parser),
    visitorPath,
    comment,
    parser,
  });
  process.exit(0);
}

async function transformByArgs(cmd) {
  const {
    inputPath,
    outputPath,
    visitorPath,
    comment,
    parser,
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

  const getTransformFn = input => transformFile({
    inputPath: input,
    outputPath: getOutputPath(input, outputPath, parser),
    visitorPath,
    comment,
    parser,
  });

  const inputStat = fs.lstatSync(inputPath);
  if (inputStat.isFile() && path.extname(inputPath) === '.js') {
    await getTransformFn(inputPath);
    process.exit(0);
  } else if (inputStat.isDirectory()) {
    const outputsFiles = glob.sync(`${inputPath}/**/*.js`);
    await Promise.all(outputsFiles.map(filePath => getTransformFn(filePath)));
    process.exit(0);
  } else {
    error(`输入路径 ${inputPath} 不合法，请提供 js 文件或目录`);
    process.exit(1);
  }
}

module.exports.transformByInquirer = transformByInquirer;

module.exports.transformByArgs = transformByArgs;
