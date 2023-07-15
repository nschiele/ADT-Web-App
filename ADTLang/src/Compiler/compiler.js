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

            //console.log(JSON.stringify(abstractSyntaxTree));
            
            /* Intermediate Statements Stage */
            let abstractSyntaxTreeVisitor = new ast.AbstractSyntaxTreeVisitor(abstractSyntaxTree);
            abstractSyntaxTreeVisitor.visit(abstractSyntaxTree.getRoot());

            /* XML Generation Stage */
            let interpreter = new intr.Interpreter(abstractSyntaxTreeVisitor.intermediateCode);
            return interpreter.xmlstring;
        }
    }
}
