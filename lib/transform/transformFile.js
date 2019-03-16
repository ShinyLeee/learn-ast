const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const traverse = require('@babel/traverse').default;
const getParser = require('./getParser');
const getGenerator = require('./getGenerator');
const { info, success } = require('../log');

/**
 *
 * @param {string} opts.inputPath - input path
 * @param {String} opts.outputPath - output path
 * @param {Object} opts.visitorPath - visitor path
 * @param {Boolean} opts.comment - 是否添加注释
 */
function transformFile(opts) {
  return new Promise((resolve) => {
    const {
      inputPath,
      outputPath,
      visitorPath,
      comment,
      parser,
    } = opts;
    const code = fs.readFileSync(inputPath, { encoding: 'utf-8' });
    const visitor = require(path.resolve(visitorPath));

    info(`\n开始转译...\n${inputPath}\n`);
    const time = Date.now();

    const parse = getParser(parser);
    const generate = getGenerator(parser);

    const ast = parse(code);

    traverse(ast, visitor);

    const ret = generate(ast, code);

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

    success(`\n在 ${duration} 时间内完成导出: \n${filePath}\n`);

    resolve();
  });
}

module.exports = transformFile;
