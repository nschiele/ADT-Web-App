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
    }


    add_child(n, display){
        n.parent = this;
        n.root = this.root;
        this.children.push(n);
        this.dis.update_width(this);
        this.dis.adjust_children(root);
    }

    set_refinement(r){
        this.refinement = r;
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


