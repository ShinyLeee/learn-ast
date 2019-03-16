const generate = require('@babel/generator').default;
const recast = require('recast');

function getGenerator(name) {
  let parser;
  switch (name) {
    case 'babel':
      parser = (ast, code) => generate(ast, {}, code);
      break;
    case 'recast':
      parser = ast => recast.print(ast);
      break;
    default:
      parser = (ast, code) => generate(ast, {}, code);
      break;
  }
  return parser;
}

module.exports = getGenerator;
