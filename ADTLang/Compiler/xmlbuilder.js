
module.exports = {
    XMLNode: class XMLNode
    {
        constructor(label, refinement,type, parent = null)
        {
            this.label = label;
            this.refinement = refinement;
            this.children = [];
            this.type = type;
            this.parent = parent;
        }
        accept(xmltree)
        {
            return xmltree.visit(this);
        }
        append(xmlnode)
        {
            if(xmlnode.parent != null ) throw Error("Node already has parent cannot be appended to node");
            this.children.push(xmlnode);
            xmlnode.parent = this;
        }
    },
    XMLTree: class XMLTree
    {
        constructor(root)
        {
            this.root = root;
            this.spacing = '';
        }
        print(indentation = '    ')
        {
            console.log("<?xml version='1.0'?>")
            console.log("<adtree>");
            this.spacing = indentation;
            this.visit(this.root, indentation);
            console.log("</adtree>");
        }
        visit(node, indentation)
        {
            let nodetag = indentation + '<node refinement=\"' + node.refinement + '\">';
            console.log(nodetag);
            console.log(indentation + this.spacing + '<label>' + node.label +'</label>');

            node.children.forEach( c => {
                this.visit(c, indentation + this.spacing + this.spacing);
            });

            let endtag = indentation + '</node>';
            console.log(endtag);
        }
    }
}
