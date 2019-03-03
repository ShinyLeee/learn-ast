const program = require('commander');
const { transformByInquirer, transformByArgs } = require('./transform');
const { warning } = require('./log');

program
  .version('0.1.0')
  .name('Awesome Cli');

program
  .command('transform')
  .description('基于babel转译js代码')
  .option('-i, --input-path <inputPath>', '待转译代码文件路径')
  .option('-v, --visitor-path <visitorPath>', '转译代码规则文件路径')
  .option('-o, --output-path [outputPath]', '转译后文件放置路径')
  .option('-q, --question [question]', '是否使用询问式输入必填参数', false)
  .option('-c, --comment [comment]', '是否给输出文件添加转译时间等信息', true)
  .action(async (cmd, subCmd) => {
    if (subCmd) {
      subCmd.outputHelp();
      process.exit(1);
    }
    if (cmd && cmd.question) {
      transformByInquirer(cmd);
      return;
    }
    transformByArgs(cmd);
  });

program.on('command:*', () => {
  const cmds = program.args.join(' ');
  warning(`无效的命令: ${cmds}\n 输入 --help 查看所有可用的命令.`);
  process.exit(1);
});

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}
