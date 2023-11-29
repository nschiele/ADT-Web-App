class ADTree{
    // Constructor ADTree
    constructor(inputVal){
        this.children = [];
        this.name = "ROOT NODE!";
        this.root;
        this.isDragging = false;
        this.contextEnabled = false;
        let btn = null;
        this.oldX = canvasElement.position().x;
        this.oldY = canvasElement.position().y;
        if (inputVal == null) { // if input NOT given, use nodeChildTextInput. Else, use input.
            let textVal = select("#nodeChildTextInput").elt.value;
            if (!textVal){ // if nodeChildTextInput empty, use placeholder
                this.root = createElement('textarea'); // placeholder
                this.root.elt.value = "Placeholder";
            }
            else{
                this.root = createElement('textarea'); // textval
                this.root.elt.value = textVal;
            }
        } else {
            this.root = createElement('textarea'); // inputval
            this.root.elt.value = inputVal;
        } 
        this.root.attribute('rows', '1');
        this.root.attribute('cols', '27')
        this.root.addClass('Node'); // add styling
        this.root.position(canvasElement.position().x, canvasElement.position().y) // set pos to top-left of canvas
        // this.root.mouseClicked(this.runtest.bind(this));
        this.root.elt.addEventListener('focus', this.focusing.bind(this))
        this.root.elt.addEventListener('blur', this.unfocusing.bind(this))
        this.root.elt.addEventListener('mousedown', this.inputPressed.bind(this))
        this.root.elt.addEventListener('mouseup', this.inputReleased.bind(this))
        this.root.elt.addEventListener('input', this.resizeInputBox.bind(this))
    }

    // addChild(inputNode){
    //     // this.children.push(inputNode)
    // }
    resizeInputBox() {
        console.log("input detected");
        console.log(this.root.elt.value.length);
        console.log(this.root.elt.offsetHeight);
        this.root.attribute('rows', (ceil(this.root.elt.value.length/21)));
        // this.root.size(this.root.width, 35*(ceil(this.root.elt.value.length/21)));
    }

    addChild(){
        console.log("TEST RAN SUCCESFULLY!");
        let newChild = new ADTree("Child");
        newChild.root.position(this.oldX - 50 + (this.children.length - 1)*50, this.oldY + 50);
        this.children.push(newChild);
    }
    toggleContextMenu(){
        if (this.contextEnabled){
            console.log("removing button");
            this.btn.remove();
        } else {
            console.log("adding button");
            this.btn = createButton("+");
            this.btn.position(this.root.position().x+this.root.width/2 - this.btn.width/2, this.root.position().y+this.root.height+5);
            this.btn.addClass('contextAddChild');
            this.btn.mousePressed(this.addChild.bind(this));
        }
        this.contextEnabled = !this.contextEnabled;
    }
    focusing(){
        console.log("focusing");
        active = this;
        this.toggleContextMenu();
        this.root.style("border", "2px solid #FF6464");
        
    }
    unfocusing(){
        console.log("unfocusing");
        console.log(this.name);
        active = null;
        this.toggleContextMenu();
        this.root.style("border", "2px solid darkgray");
    }
    inputPressed(){
        console.log(mouseX + canvasElement.position().x, mouseY + canvasElement.position().y, this.root.position().x, this.root.position().y)
        console.log("pressed");
        this.oldX = this.root.x;
        this.oldY = this.root.y;
    }
    inputReleased(){
        console.log("unpressed");
        this.isDragging = false;
        this.oldX = this.root.x;
        this.oldY = this.root.y;
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
            this.btn.position(this.root.x+this.root.width/2 - this.btn.width/2, this.root.y+this.root.height+5);
        
    }
}