class ADTree{
    // Constructor ADTree
    constructor(label, IDnumber){
        this.children = [];
        this.type = 0;
        this.refinement = 0;
        this.id = IDnumber;
        this.label = label;
        this.attributes;
        // Parent & Root?
        this.parent = null;
        this.root = this;
        this.dis = new Display(label, this.id, 0, 0, 2);
        this.dis.tree = this;
        this.xmlNode;
        this.attackNodeHasDefenseNode; // To make sure an attack node only has one defense node.
        this.defenseNodeHasAttackNode; // To make sure a defense node only has one attack node.
    }


    add_child(n){
        let tempSwitch;
        let switchIndex;
        let switchIt = false;

        n.parent = this;
        n.root = this.root;

        this.children.push(n);

        for (let i = 0; i < this.children.length; i++){
          if (this.type != this.children[i].type){
            tempSwitch = this.children[i];
            switchIt = true;
            switchIndex = i;
            break;
          }
        }

        if (switchIt){
          this.children[switchIndex] = this.children[this.children.length-1];
          this.children[this.children.length-1] = tempSwitch;
        }
        
        this.dis.update_width(this);
        this.dis.adjust_children(root);
    }

    set_refinement(r){
        this.refinement = r;
    }

    set_type(type){
        this.type = type;
    }

    getMultiArray(){
        var toReturn = [this.t];
        if(this.children.length > 0){
            toReturn.push(this.refinement);
            toReturn.push([]);
            for(let i = 0; i < this.children.length; i++){
                toReturn[2].push(this.children[i].getMultiArray());
            }
        }
    }

    adjust_children(){
        this.dis.adjust_children(this);
    }

    display(){
        this.dis.display(this);
    }

    checkCoordinates(x, y){
        this.dis.checkCoordinates(this, x, y);
    }

    update_width(){
        this.dis.update_width(this);
    }

    display(){
        this.dis.display(this);
    }

    clearActive(){
        this.dis.clearActive(this);
    }

    getActive(){
        console.log("ran: ", this);
        if (this.dis.getActive(this) == true){
            return this;
        }
        // return this;
    }

    getID(ID) { // Currently not used, probably not necessary and will be removed in future push!
        if (this.id == ID) {
            return this;
        } else {
            for (var i = 0; i < this.children.length; i++) {
                var result = this.children[i].getID(ID);  // Pass ID instead of this.children[i].id
                if (this.id == ID) {
                    return this;  // Return the result if found
                }
            }
        }
        return null;  // Return null if ID is not found
    }

    compareNames(label){
        if (this.label === label) {
            return this;
        }
        if (this.children && this.children.length > 0) {
            for (let i = 0; i < this.children.length; i++) {
                const result = this.children[i].compareNames(label);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    removeSubTree(node){
        if (this === node) {
            console.log("Root is tried to be deleted.");
        }
        if (this.children && this.children.length > 0) {
            for (let i = 0; i < this.children.length; i++) {
                if (this.children[i] === node) {
                    this.children.splice(i, 1);
                }
                // const result = this.children[i].removeSubTree(node);
                if (this.children[i] && this.children[i].removeSubTree(node)) {
                    return true;
                }
            }
        }
        return null;
    }

    convertADTtoNode(parent) {
        console.log("node: ", this);
        var newNode;
        if (this == root) {
            var nodeRoot = new Node();
            nodeRoot.label = this.label;
            nodeRoot.refinement = this.refinement;
            nodeRoot.depth = this.dis.level;
            nodeRoot.swith_role = this.type;
            nodeRoot.parent = null;
            console.log("new node: ", nodeRoot);
            newNode = nodeRoot;
            this.xmlNode = nodeRoot;
        } else {
            var ADTnode = new Node();
            ADTnode.label = this.label;
            ADTnode.refinement = this.refinement;
            ADTnode.depth = this.dis.level;
            ADTnode.swith_role = this.type;
            ADTnode.parent = parent;
            console.log("new node: ", ADTnode);
            newNode = ADTnode;
            this.xmlNode = ADTnode;
        }
        if (this.children && this.children.length > 0) {
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].convertADTtoNode(newNode);
            }
        }
    }

    addChildInXML(temp_string){
        console.log("THE XMLNODE: ", this.xmlNode);
        temp_string = add_child(this.xmlNode, temp_string, 1);
        if (this.children && this.children.length > 0) {
            for (let i = 0; i < this.children.length; i++) {
                temp_string = this.children[i].addChildInXML(temp_string);
            }
        }
        temp_string += '\n';
        temp_string += "  ";
        for (var i = 0; i < this.xmlNode.depth; i++){
            temp_string += "    ";
        }
        temp_string += '</node>';
        console.log("it: ", temp_string);
        return temp_string;
    }

    initialColor() {
        if (this.children && this.children.length > 0) {
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].initialColor();
            }
        }
        if(this.type == 0) {
            console.log("ice", this);
            this.dis.stroke = color('red');
            this.dis.strokeWeight = 3;
            this.dis.r = 50;
        } else if (this.type == 1) {
            this.dis.stroke = color('green');
            this.dis.strokeWeight = 3;
            this.dis.r = 1;
        }
    }

    checkParentChild(attack, parentCheck) {
        console.log("PCHECK");
        if (attack) { // Attack node, user wants to make this defense node
            // Parent check
            // Check if parent is defense already, then just return true.
            var defNodeCounter = 0;
            if (this.parent != null) {
                if ((this.parent.type === 0 && this.parent.children && this.parent.children.length > 0) || (this.parent === null)) {
                    // If attack node, then count all parents children, and check how many are defense nodes.
                    for (let i = 0; i < this.parent.children.length; i++) {
                        if (this.parent.children[i].type === 1) {
                            defNodeCounter++;
                        }
                    }
                    if (defNodeCounter != 0) {
                        // If 1 or more defense children, and attack parent, then no more defense children allowed.
                        return -1;
                    } 
                }
            }
            // Children check
            // Check if any children of attack node that will be defense node are attack nodes.
            var attChildrenCounter = 0;
            if ((this.children && this.children.length > 0) || (!this.children)) {
                for (let j = 0; j < this.children.length; j++) {
                    if (this.children[j].type === 0) {
                        attChildrenCounter++;
                    }
                }
                if (attChildrenCounter > 1) {
                    // If more than one attack node, and parent will be defense node, than defense node will have >1
                    // attack children. Not possible, so return false.
                    return -2;
                }
            }
            // If both parents check and children check succeed, return true.
            return 0;
        } else if (!attack) { // Defense node, user wants to make this attack node
            // Parent check
            // Check if parent is attack already, then just return true.
            var attNodeCounter = 0;
            if (this.parent != null) {
                if ((this.parent.type === 1 && this.parent.children && this.parent.children.length > 0) || (this.parent === null)) {
                    // If defense node, then count all parents children, and check how many are attack nodes.
                    for (let i = 0; i < this.parent.children.length; i++) {
                        if (this.parent.children[i].type === 0) {
                            attNodeCounter++;
                        }
                    }
                    if (attNodeCounter != 0) {
                        // If 1 or more attack children, and defense parent, then no more attack children allowed.
                        return -1;
                    }
                } 
            }
            // Children check
            // Check if any children of defense node that will be attack node are defense nodes.
            var defChildrenCounter = 0;
            if ((this.children && this.children.length > 0) || (!this.children)) {
                for (let j = 0; j < this.children.length; j++) {
                    if (this.children[j].type === 1) {
                        defChildrenCounter++;
                    }
                }
                if (defChildrenCounter > 1) {
                    // If more than one attack node, and parent will be defense node, than defense node will have >1
                    // attack children. Not possible, so return false.
                    return -2;
                }
            }
            return 0;
        }
        return -3;
    }

    checkForWarnings(){
        if (this.children && this.children.length > 0) {
            for (let i = 0; i < this.children.length; i++) {
                console.log("colors: ", this.dis.stroke.levels);
                if (this.dis.stroke.levels[0] === 0 && this.dis.stroke.levels[1] === 0) {
                    console.log
                    return false;
                }
                if (!this.children[i].checkForWarnings()) {
                    return false;
                }
            }
        }
        return true;
    }

    // setNodeStruc(parent) {
    //     if (this !== root) {

    //     }
    //     if (this.children && this.children.length > 0) {
    //         for (let i = 0; i < this.children.length; i++) {
    //             this.children[i].convertADTtoNode();
    //         }
    //     }
    // }


}

/**
 * Node
- List of children
- type of node
- type of refinement
- id of node
- label of node
- dictionary of attributes
 */
