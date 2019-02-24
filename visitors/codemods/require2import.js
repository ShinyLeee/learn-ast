/* eslint-disable quotes */
const t = require('@babel/types');
const template = require('@babel/template').default;

const visitor = {
  CallExpression(path) {
    if (t.isIdentifier(path.node.callee, { name: 'require' })) {
      const moduleName = path.node.arguments[0].value;
      if (t.isIdentifier(path.parent.id)) {
        const varName = path.parent.id.name;
        const needReplacePath = path.findParent(parent => parent.isVariableDeclaration());
        const buildRequire = template(`import IMPORT_NAME from 'SOURCE'`);
        const newNode = buildRequire({
          IMPORT_NAME: t.identifier(varName),
          SOURCE: t.stringLiteral(moduleName),
        });
        needReplacePath.replaceWith(newNode);
      }
      if (t.isObjectPattern(path.parent.id)) {
        const { properties = [] } = path.parent.id;
        if (properties.length !== 0) {
          const needReplacePath = path.findParent(parent => parent.isVariableDeclaration());
          const specifiers = properties.map(
            prop => t.importSpecifier(
              t.identifier(prop.key.name),
              t.identifier(prop.key.name),
            ),
          );
          const newNode = t.importDeclaration(
            specifiers,
            t.stringLiteral(moduleName),
          );
          needReplacePath.replaceWith(newNode);
        }
      }
    }
  },
};

module.exports = visitor;
