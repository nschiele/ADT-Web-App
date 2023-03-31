//const abstractSyntaxTree = require('./abstractSyntaxTree');
const ast = require('./abstractSyntaxTree');
const intr = require('./intermediateCodeGenerator');
const prs = require('./parser');

module.exports = {
    Compiler: class Compiler
    {
        constructor(sourcecode)
        {
            this.sourcecode = sourcecode;
            this.parser = new prs.Parser();
        }
        compile()
        {
            /* Parser Stage */
            let parsedSourcecode = this.parser.parse(this.sourcecode);

            /* Abatract Syntax Tree Stage */
            let abstractSyntaxTree = parsedSourcecode.buildAST();
            let abstractSyntaxTreeVisitor = new ast.AbstractSyntaxTreeVisitor(abstractSyntaxTree);

            /* Intermediate Statements Stage */
            abstractSyntaxTreeVisitor.visit(abstractSyntaxTree.getRoot());

            /* XML Generation Stage */
            let interpreter = new intr.Interpreter(abstractSyntaxTreeVisitor.intermediateCode);
        }
    }
}
