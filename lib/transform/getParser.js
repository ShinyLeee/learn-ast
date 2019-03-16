const babel = require('@babel/parser');
const recast = require('recast');

function getParser(name) {
  let parser;
  switch (name) {
    case 'babel':
      parser = code => babel.parse(code, {
        sourceType: 'module',
        plugins: [
          'jsx',
          'classProperties',
        ],
      });
      break;
    case 'recast':
      parser = code => recast.parse(code, {
        parser: require('recast/parsers/babel'),
      });
      break;
    default:
      parser = code => babel.parse(code, {
        sourceType: 'module',
        plugins: [
          'jsx',
          'classProperties',
        ],
      });
      break;
  }
  return parser;
}

module.exports = getParser;
