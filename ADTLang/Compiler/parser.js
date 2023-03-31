const fs = require('fs');
const ohm = require('ohm-js');
const ast = require('./abstractSyntaxTree');

module.exports = {
    Parser: class Parser
    {
        constructor()
        {
            this.contents = fs.readFileSync('Compiler/ADTLang.ohm', 'utf-8');
            this.grammar = ohm.grammar(this.contents);
            this.semantics = this.grammar.createSemantics();
            this.semantics.addOperation('buildAST', {
                Start(statements) {
                    statements = statements.buildAST();
                    let root = ast.createStatementsNode();
                    statements.forEach(element => {
                        root.addChild(element);
                    });
            
                    return new ast.AbstractSyntaxTree(root);
                },
                _iter(...children) {
                    return children.map(c => c.buildAST());
                },
                Statement(statement) {
                    return statement.buildAST();
                },
                CreateStatement(_create, nodetype, children, _label, _is, string, relation, append, _endstatement) {

                    nodetype = nodetype.buildAST();
                    string = string.buildAST();
                    relation = relation.buildAST();
                    children = children.buildAST();
                    append = append.buildAST();
            
                    let node = ast.createCreateNode(string, relation, nodetype);
            
                    if (children.length !== 0) node.addChildren(children, string); 
                    if(append.length !== 0) node.addChild(ast.createAppendNode(string, append[0]));
            
                    return node;
                },
                CreateAppend(_append, _to, string)
                {
                    string = string.buildAST();
                    return string;
                },
                AppendStatement(_append, StringList, _to, string, _endstatement)
                {
                    StringList = StringList.buildAST();
                    string = string.buildAST();
                    let appends = []
                    
                    StringList.map( element => {
                        appends.push(ast.createAppendNode(element, string) );
                    });

                    if(appends.lenght !== 0)
                    {
                        let node = ast.createAppendNodes(appends);
                        return node;
                    }

                    throw Error("idk tood:");
                },
                Relation(_has, booleanoperator, _relation) {
                    return booleanoperator.buildAST();
                },
                Children(_with, digit, _children, StringList) {
                    let children = StringList.buildAST();
                    let node = new ast.Node(ast.NodeType.CHILDREN, {});

                    children.forEach(element => {
                        node.addChild(ast.createChildNode(ast.createCreateNode(element, [], "attack"), 
                                        ast.createAppendNode(element, "")));
                    });
                    
                    return node;
                },
                StringList(stringlist) {
                    return stringlist.asIteration().children.map(c => c.buildAST());
                },
                booleanoperator(booleanoperator) {
                    booleanoperator = String(booleanoperator.sourceString);
                    return ast.RelationType[booleanoperator];
                },
                NodeType(type, _node) {
                    return String(type.sourceString);
                },
                string(_lquote, Words, _rquote) {
                    return Words.buildAST();
                },
                words(word, _spaces, words) {
                    let w = words.buildAST();
                    let str = word.buildAST();
            
                    w.forEach(element => {
                        str += " " + element;
                    });
            
                    return str;
                },
                word(word) {
                    return String(word.sourceString);
                }
            })
        }
        parse(sourcecode)
        {
            let syntaxMatcher = this.grammar.match(sourcecode);
            return this.semantics(syntaxMatcher);
        }
    }

}