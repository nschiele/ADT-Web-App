
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
            //TODO MAYBE WE DO ALLOW A NODE TO BE APPENDED TO ANOTHER NODE;
            if(this.label === xmlnode.label) throw Error(`[Runtime rrror in XML generation]Cannot append node with label: "${xmlnode.label}" to itself`);
            //if(xmlnode.parent != null ) throw Error("Node already has parent cannot be appended to node");
            //TODO: CHECK THAT ONLY ONE NODE OF OPPOSITE TYPE CAN BE APPENDED;
            if(xmlnode.type != this.type)
            {
                this.children.map( element => {
                    if(element.type != this.type) throw Error(`[Runtime error in XML generation] node with label: "${this.label}" already contains a countermeasure node`);
                });
            }

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
            this.xmlstring = '';
        }
        print(indentation = '    ')
        {
            this.xmlstring += "<?xml version='1.0'?>\n"
            console.log("<?xml version='1.0'?>\n")
            this.xmlstring += "<adtree>\n"
            console.log("<adtree>\n");
            this.spacing = indentation;
            this.visit(this.root, indentation);
            this.xmlstring += "</adtree>\n"
            console.log("</adtree>\n");
            return this.xmlstring;
        }
        visit(node, indentation)
        {
            let switchRole = ''
            
            if(node.parent && (node.type !== node.parent.type)) switchRole = ' switchRole=\"yes\"';
            let nodetag = indentation + '<node refinement=\"' + node.refinement + "\"" + switchRole + '>\n';
            this.xmlstring += nodetag
            console.log(nodetag);
            this.xmlstring += indentation + this.spacing + '<label>' + node.label +'</label>\n';
            console.log(indentation + this.spacing + '<label>' + node.label +'</label>\n');

            node.children.forEach( c => {
                this.visit(c, indentation + this.spacing + this.spacing);
            });

            let endtag = indentation + '</node>';
            this.xmlstring += indentation + '</node>\n';
            console.log(endtag);
        }
    }
}
