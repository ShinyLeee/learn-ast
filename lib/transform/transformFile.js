const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const { info, success } = require('../log');

/**
 *
 * @param {string} inputPath - input path
 * @param {String} outputPath - output path
 * @param {Object} visitorPath - visitor path
 * @param {Function} callback
 */
function transformFile(inputPath, outputPath, visitorPath, callback) {
  const code = fs.readFileSync(inputPath, { encoding: 'utf-8' });
  const visitor = require(path.resolve(visitorPath));

  info('开始转译...\n');
  const time = Date.now();

  const ast = parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'classProperties',
    ],
  });

  traverse(ast, visitor);

  const ret = generate(ast, {}, code);

  const t = Date.now() - time;
  const duration = t > 1000 ? `${t / 1000}s` : `${t}ms`;

  const isFileExist = fs.existsSync(outputPath);

  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  const data = isFileExist
    ? `\n// 生成于 ${now}, 转译时长${duration}\n${ret.code}\n`
    : `// 生成于 ${now}, 转译时长${duration}\n${ret.code}\n`;

  fs.appendFileSync(outputPath, data);

  success(`在 ${duration} 时间内完成`);

  if (typeof callback === 'function') {
    callback();
  }
}

module.exports = transformFile;