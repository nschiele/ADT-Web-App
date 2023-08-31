const icg = require('./intermediateCodeGenerator');
module.exports = {
    NodeType: NodeType = {
        STATEMENTS: "statementsNode",
        CREATE: "createNode",
        DELETE: "deleteNode",
        UPDATE: "updateNode",
        APPEND: "appendNode",
        CHILDREN: "childrenNode",
        CHILD: "child"
    },
    RelationType: RelationType  ={
        or: "disjunctive",
        and: "conjuctive"
    },
    Variable: class Variable {
        constructor(label, relation, nodetype)
        {
            this.label = label;
            this.relation = relation;
            this.nodetype = nodetype;
        }
    },
    AppendSymbol: class AppendSymbol {
        constructor(from, to)
        {
            this.from = from;
            this.to = to;
        }
    },
    SymbolTable: class SymbolTable {
        constructor()
        {
            this.symbols = [];
        }
        addSymbol(symbol)
        {
            if(this.findSymbol(symbol.label) !== null) throw new Error(`[Semantic Error in Create Statement] node with label: "${symbol.label}" is already defined`);
            this.symbols.push(symbol);
        }
        findSymbol(label)
        {
            let result = this.symbols.filter( symbol => {
                if (symbol.label === label) return symbol;
            });
            return result.length == 0 ? null : result[0];
        }
    },
    Node: class Node {
        constructor(type, values) 
        {
                this.type  = type;
                this.values = values;
                this.children = [];
        }
        addChild(child)
        {
            this.children.push(child);
        }
        addChildren(children, string)
        {
            this.children = children;

            this.children[0].children.forEach( child => {
                child.children[1].values.to = string;
            });
        }
        accept(visitor)
        {
            return visitor.visit(this);
        }
    },
    AbstractSyntaxTree: class AbstractSyntaxTree {
        constructor(root)
        {
            this.root = root;
            this.symbolTable = new module.exports.SymbolTable();
        }
        getRoot()
        {
            return this.root;
        }
    },
    AbstractSyntaxTreeVisitor: class AbstractSyntaxTreeVisitor {
        constructor(abstractSyntaxTree)
        {
            this.intermediateCode = new icg.IntermediateCode(abstractSyntaxTree.symbolTable);
            this.abstractSyntaxTree = abstractSyntaxTree;
        }
        printICG()
        {
            console.log(this.intermediateCode);
        }
        visit(node)
        {
            let nodeType = node.type;

            switch(nodeType) {
                case module.exports.NodeType.STATEMENTS:
                    break;
                case module.exports.NodeType.CREATE:
                {
                    let variable = node.values;
                    this.abstractSyntaxTree.symbolTable.addSymbol(variable);
                    let intermediateStatement = new icg.IntermediateStatement(icg.IntermediateStatementType.CREATE, variable);
                    this.intermediateCode.addStatement(intermediateStatement);
                    break;
                }
                case module.exports.NodeType.APPEND:
                {
                    let variable = node.values;
                    if(this.abstractSyntaxTree.symbolTable.findSymbol(variable.to) === null ) throw new Error(`[Semantic Error in append statement] Node with label: "${variable.to}" could not be found`);
                    if(this.abstractSyntaxTree.symbolTable.findSymbol(variable.from) === null ) throw new Error(`[Semantic Error in append statement] Node with label: "${variable.from}" could not be found`);
                    let intermediateStatement = new icg.IntermediateStatement(icg.IntermediateStatementType.APPEND, variable);
                    this.intermediateCode.addStatement(intermediateStatement);                    
                    break;
                }
                case module.exports.NodeType.UPDATE:
                {
                    let variable = node.values;
                    let intermediateStatement = new icg.IntermediateStatement(icg.IntermediateStatementType.APPEND, variable);
                    this.intermediateCode.addStatement(intermediateStatement);                    
                    break;
                }
                case module.exports.NodeType.CHILDREN:
                    break;
                default:
                    break;
            }

            node.children.map( child => {
                child.accept(this);
            })
            
        }
    },
    createCreateNode: function createCreateNode(label, relation, type)
    {
        relation = relation.length == 0 ? this.RelationType.or : relation[0];
        values = new module.exports.Variable(label, relation, type);
        return new module.exports.Node(this.NodeType.CREATE, values);
    },
    createStatementsNode: function createStatementsNode()
    {
        return new this.Node(this.NodeType.STATEMENTS, {});
    },
    createAppendNode: function createAppendNode(from, to)
    {
        let appendSymbol = new module.exports.AppendSymbol(from, to);
        return new module.exports.Node(this.NodeType.APPEND, appendSymbol);
    },
    createChildNode: function createChildNode(create, append)
    {
        let node = new module.exports.Node(module.exports.NodeType.CHILD, {});
        node.addChild(create);
        node.addChild(append);
        return node;
    },
    createAppendNodes: function createAppendsNodes(append)
    {
        let node = new module.exports.Node(module.exports.NodeType.STATEMENTS);
        node.children = append;
        return node;
    }
}