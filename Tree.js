class ADTree{
    // Constructor ADTree
    constructor(inputVal){
        this.children = [];
        this.name = "ROOT NODE!";
        this.root;
        this.isDragging = false;
        this.contextEnabled = false;
        let btn = null;
        this.oldX = width/2 + cX;
        this.oldY = height/8 + cY;
        if (inputVal == null) { // if input NOT given, use nodeChildTextInput. Else, use input.
            let textVal = select("#nodeChildTextInput").elt.value;
            if (!textVal){ // if nodeChildTextInput empty, use placeholder
                this.root = createSpan("Placeholder"); // placeholder
            }
            else{
                this.root = createSpan(textVal); // textval
            }
        } else {
            this.root = createSpan(inputVal); // inputval
        } 
        this.root.attribute('contenteditable', 'true');
        this.root.attribute('role', 'textbox');
        this.root.addClass('Node'); // add styling
        this.root.position(this.oldX - 150, this.oldY) // set pos to top-left of canvas
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
        // console.log(this.root.elt.value.length);
        console.log(this.root.elt.offsetHeight);
        console.log(this.root.elt.offsetWidth, this.root.elt.offsetHeight);
        this.btn.position(this.root.position().x+this.root.elt.offsetWidth/2 - this.btn.width/2, this.root.position().y+this.root.elt.offsetHeight);
    }

    addChild(){
        let newChild = new ADTree("Child");
        newChild.root.position(this.oldX - 50 + (this.children.length - 1)*50, this.oldY + 50);
        this.children.push(newChild);
        this.root.elt.focus();
        // draw line between parent and child
        line(this.root.x + this.root.elt.offsetWidth/2, this.root.y + this.root.elt.offsetHeight, newChild.root.x + newChild.root.elt.offsetWidth/2, newChild.root.y);
    }
    toggleContextMenu(){
        if (this.contextEnabled){
            this.btn.remove();
        } else {
            this.btn = createButton("+");
            this.btn.position(this.root.position().x+this.root.elt.offsetWidth/2 - this.btn.width/2, this.root.position().y+this.root.elt.offsetHeight);
            this.btn.addClass('contextAddChild');
            this.btn.mousePressed(this.addChild.bind(this));
        }
        this.contextEnabled = !this.contextEnabled;
    }
    focusing(){
        active = this;
        this.toggleContextMenu();
        this.root.style("border", "2px solid #FF6464");
        
    }
    unfocusing(){
        console.log(this.name);
        active = null;
        this.toggleContextMenu();
        this.root.style("border", "2px solid darkgray");
    }
    inputPressed(){
        console.log(mouseX + canvasElement.position().x, mouseY + canvasElement.position().y, this.root.position().x, this.root.position().y)
        this.oldX = this.root.x;
        this.oldY = this.root.y;
    }
    inputReleased(){
        this.isDragging = false;
        this.oldX = this.root.x;
        this.oldY = this.root.y;
        this.root.elt.focus();
    }
    setPos(X,Y){
        if (
            mouseX + canvasElement.position().x < this.oldX-10 ||
            mouseX + canvasElement.position().x > this.oldX+this.root.elt.offsetWidth+10 ||
            mouseY + canvasElement.position().y < this.oldY-10 ||
            mouseY + canvasElement.position().y > this.oldY+this.root.elt.offsetHeight+10
        ){
            this.isDragging = true;
            this.root.elt.blur();
            active = this;
        }
        if (this.isDragging == true)
            this.root.position(canvasElement.position().x+X-this.root.elt.offsetWidth/2,canvasElement.position().y+Y-this.root.elt.offsetHeight/2);
            this.btn.position(this.root.position().x+this.root.elt.offsetWidth/2 - this.btn.width/2, this.root.position().y+this.root.elt.offsetHeight);
        
    }
}