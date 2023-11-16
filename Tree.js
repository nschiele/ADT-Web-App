class ADTree{
    // Constructor ADTree
    constructor(inputVal){
        this.name = "ROOT NODE!";
        this.root;
        this.offsetX;
        this.x = canvasElement.position().x;
        this.offsetY;
        this.y = canvasElement.position().y;
        this.isDragging = false;
        if (inputVal == null) { // if input NOT given, use nodeChildTextInput. Else, use input.
            let textVal = select("#nodeChildTextInput").elt.value;
            if (!textVal) // if nodeChildTextInput empty, use placeholder
                this.root = createInput("Placeholder");
            else
            this.root = createInput(textVal);
        } else {
            this.root = createInput(inputVal);
        } 
        this.root.addClass('Node'); // add styling
        this.root.position(canvasElement.position().x, canvasElement.position().y) // set pos to top-left of canvas
        this.root.mouseClicked(this.runtest.bind(this));
        this.root.elt.addEventListener('focus', this.focusing.bind(this))
        this.root.elt.addEventListener('blur', this.unfocusing.bind(this))
        this.root.elt.addEventListener('mousedown', this.inputPressed.bind(this))
        this.root.elt.addEventListener('mouseup', this.inputReleased.bind(this))
    }

    // addChild(inputNode){
    //     // this.children.push(inputNode)
    // }
    runtest(){
        console.log(this.name);
    }
    focusing(){
        console.log("focusing");
        
    }
    unfocusing(){
        console.log("unfocusing");
        console.log(this.name);
    }
    inputPressed(){
        console.log("pressed");
        active = this;
        
    }
    inputReleased(){
        active = null;
        console.log("unpressed");
        this.isDragging = false;
    }
    setPos(X,Y){
        this.root.position(canvasElement.position().x+X-this.root.width/2,canvasElement.position().y+Y-this.root.height/2);
        console.log(this.root.width/2);
    }
}