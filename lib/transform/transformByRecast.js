const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const recast = require('recast');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const { info, success } = require('../log');

/**
 *
 * @param {string} opts.inputPath - input path
 * @param {String} opts.outputPath - output path
 * @param {Object} opts.visitorPath - visitor path
 * @param {Boolean} opts.comment - 是否添加注释
 * @param {Function} callback
 */
function transformFile(opts, callback) {
  const {
    inputPath, outputPath, visitorPath, comment,
  } = opts;
  const code = fs.readFileSync(inputPath, { encoding: 'utf-8' });
  const visitor = require(path.resolve(visitorPath));

  info('开始转译...\n');
  const time = Date.now();

  const ast = recast.parse(code, {
    parser: require('recast/parsers/babel'),
  });

  traverse(ast, visitor);

  // const ret = generate(ast, {}, code);

  const ret = recast.print(ast);

  const t = Date.now() - time;
  const duration = t > 1000 ? `${t / 1000}s` : `${t}ms`;

  const isFileExist = fs.existsSync(outputPath);

  if (!isFileExist) {
    const outputDir = path.dirname(outputPath);
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const ext = path.extname(outputPath);
  const filePath = ext ? outputPath : `${outputPath}.js`;

  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const data = comment ? `// 生成于 ${now}, 转译时长${duration}\n${ret.code}` : ret.code;

  fs.appendFileSync(filePath, data);

  success(`在 ${duration} 时间内完成导出: \n ${filePath}`);

  if (typeof callback === 'function') {
    callback();
  }
}

module.exports = transformFile;
