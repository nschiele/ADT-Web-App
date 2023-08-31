const fs = require('fs');
const ohm = require('ohm-js');
const ast = require('./abstractSyntaxTree');

module.exports = {
    Parser: class Parser
    {
        constructor()
        {
            //this.contents = fs.readFileSync('Compiler/ADTLang.ohm', 'utf-8');
            this.gramdef = `ADTLangGrammar{
                Start 
                    = Statements
            
                Statements
                    = Statement+
                
                Statement
                    = CreateStatement
                    | AppendStatement
                    | UpdateStatement
            
                CreateStatement
                    = create NodeType (label is)? string Children? Relation? CreateAppend? endstatement
            
                AppendStatement
                    = append StringList to string endstatement
                
                CreateAppend
                    = append to string
                
                UpdateStatement
                    = update StringList attribute StringList
            
                attribute
                    = label
                    | relation
                
                update
                    = "update"
            
                Relation
                    = has booleanoperator relation
                
                Children
                    = with children StringList
                
                StringList
                    = NonemptyListOf<string, ",">
            
                NodeType
                    = type node
                
                node
                    = "node"
                
                type
                    = "attack"
                    | "defense"
            
                counter
                    = "counter"
            
                create
                    = "create"
            
                append
                    = "append"
            
                root
                    = "root"
            
                label 
                    = "label"
                is
                    = "is"
                
                with
                    = "with"
            
                has
                    = "has"
            
                booleanoperator
                    = "and"
                    | "or"
            
                relation
                    = "relation"
                
                children
                    = "children"
            
                to
                    = "to"
            
                string
                    = quotes words quotes
                
                words
                    = word  (spaces word)*
            
                word
                    = (letter | digit)+
            
                quotes
                    = "\\""
                
                comment 
                    = "#" any*
            
                space
                    += comment
            
                endstatement
                    = ";"
              }`
            this.grammar = ohm.grammar(this.gramdef);
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
                CreateStatement(_create, nodetype, _label, _is, string, children, relation, append, _endstatement) {

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
                Children(_with, _children, StringList) {
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
            if( syntaxMatcher.failed())
            {
                let err = `[Syntax error during matching] message: ${syntaxMatcher.message}`;
                throw Error(err);
            }
            return this.semantics(syntaxMatcher);
        }
    }

}