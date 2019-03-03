const t = require('@babel/types');

const visitor = {
  JSXOpeningElement(path) {
    const attr = path.node.attributes;
    const { name } = path.node.name;
    const classComp = path.findParent(parent => parent.isClassDeclaration());
    const compName = classComp ? classComp.node.id.name : 'Anonymous';
    attr.push(
      t.jsxAttribute(
        t.jsxIdentifier('testID'),
        t.StringLiteral(`${compName}_${name}`),
      ),
    );
  },
};

module.exports = visitor;
