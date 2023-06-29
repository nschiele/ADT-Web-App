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
        this.dis = new Display(label, 0, 0, 2);
    }


    add_child(n, display){
        // console.log(n)
        n.parent = this;
        n.root = this.root;
        this.children.push(n);
        // this.dis = display;
        // console.log("c'est le ding", this);
        // this.label = this.dis.t;
        this.dis.update_width(this);
        this.dis.adjust_children(root);
        // console.log(this.dis.t);
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
        this.dis.getActive(this);
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


/**
 * Code for list for children:
 * 
 * const children = [];
 * 
 * When child is added
 * this.children.push[name]
 * 
 * this.
 * 
 * 
 */