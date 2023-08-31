const xmlbuilder = require('./xmlbuilder');

module.exports = {
    IntermediateStatementType: IntermediateStatementType ={
        CREATE: "createXMLNode",
        APPEND: "appendXMLNode"
    },
    IntermediateStatement: class IntermediateStatement
    {
        constructor(intermediateStatementType, values)
        {
            this.intermediateStatementType = intermediateStatementType;
            this.values = values;
        }
    },
    IntermediateCode: class IntermediateCode
    {
        constructor(symbolTable)
        {
            this.IntermediateStatements = [];
            this.symbolTable = symbolTable;
        }
        addStatement(statement)
        {
            this.IntermediateStatements.push(statement);
        }
    },
    Interpreter: class Interpreter
    {
        constructor(intermediateCode)
        {
            this.intermediateCode = intermediateCode;
            this.xmlNodes = [];
            this.executeStatements();
            this.xmlTree = new xmlbuilder.XMLTree(this.xmlNodes[0]);
            this.xmlstring = this.xmlTree.print('  ');
        }
        executeStatements()
        {
            this.intermediateCode.IntermediateStatements.map(element => {
                //console.log(element);
                this.executeStatement(element);
            });
        }
        findXMLNode(label)
        {
            for(let i=0; i<this.xmlNodes.length;i++)
            {
                let res = this.find(this.xmlNodes[i], label);
                if( res != null) return res;
            }
            throw Error("Node could not be found");
        }
        find(node, label)
        {
            if(node === null) return;

            if(node.label === label) return node;

            for(let i=0;i<node.children.length;i++)
            {
                let res = this.find(node.children[i], label);
                if(res !== null) return res;
            }
            return null;
        }
        executeStatement(statement)
        {
            //console.log(statement);
            let statementType = statement.intermediateStatementType;
            switch(statementType)
            {
                case module.exports.IntermediateStatementType.CREATE:
                {
                    let xmlNode = new xmlbuilder.XMLNode(statement.values.label, statement.values.relation,statement.values.nodetype);
                    this.xmlNodes.push(xmlNode);
                    break;
                }
                case module.exports.IntermediateStatementType.APPEND:
                {

                    let from = this.findXMLNode(statement.values.from);
                    let to = this.findXMLNode(statement.values.to);

                    if(this.find(from, to.label)) throw Error(`[Runtime Error in Append Statement] appending node with label: "${statement.values.from}" to node with label: "${statement.values.to}" creates a cycle`);
                    to.append(from);
                    break;
                }
                default:
                {
                    break;
                }
            }
            return;
        }
    }
}