class ADTree{
    // Constructor ADTree
    constructor(inputVal){
        this.name = "ROOT NODE!";
        this.root;
        this.isDragging = false;
        this.contextEnabled = false;
        let btn = null;
        this.oldX = canvasElement.position().x;
        this.oldY = canvasElement.position().y;
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
    toggleContextMenu(){
        if (this.contextEnabled){
            console.log("removing button");
            this.btn.remove();
        } else {
            console.log("adding button");
            this.btn = createButton("+");
            this.btn.position(this.oldX, this.oldY);
        }
        this.contextEnabled = !this.contextEnabled;
    }
    focusing(){
        console.log("focusing");
        active = this;
        this.toggleContextMenu();
    }
    unfocusing(){
        console.log("unfocusing");
        console.log(this.name);
        active = null;
        this.toggleContextMenu();
    }
    inputPressed(){
        console.log(mouseX + canvasElement.position().x, mouseY + canvasElement.position().y, this.root.position().x, this.root.position().y)
        console.log("pressed");
        
    }
    inputReleased(){
        console.log("unpressed");
        this.isDragging = false;
        this.oldX = this.root.position().x;
        this.oldY = this.root.position().y;
        this.root.elt.focus();
    }
    setPos(X,Y){
        if (
            mouseX + canvasElement.position().x < this.oldX-10 ||
            mouseX + canvasElement.position().x > this.oldX+this.root.width+10 ||
            mouseY + canvasElement.position().y < this.oldY-10 ||
            mouseY + canvasElement.position().y > this.oldY+this.root.height+10
        ){
            this.isDragging = true;
            this.root.elt.blur();
            active = this;
        }
        if (this.isDragging == true)
            this.root.position(canvasElement.position().x+X-this.root.width/2,canvasElement.position().y+Y-this.root.height/2);
        
    }
}