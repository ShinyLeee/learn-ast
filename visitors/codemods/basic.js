const t = require('@babel/types');

const visitor = {
  BinaryExpression(path) {
    path.node.left = t.identifier('Hello World');
  },
};

module.exports = visitor;
