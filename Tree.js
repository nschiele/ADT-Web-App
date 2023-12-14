class ADTree{
    // Constructor ADTree
    constructor(inputVal){
        this.children = [];
        this.name = "ROOT NODE!";
        this.root;
        this.refinementIsAnd = false;
        this.isDefense = false;
        this.isDragging = false;
        this.contextEnabled = false;
        let Plusbtn = null;
        let Refinebtn = null;
        let AtkDefBtn = null;
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

    resizeInputBox() {
        this.Plusbtn.position(this.root.position().x+this.root.elt.offsetWidth/2 - this.Plusbtn.width/2, this.root.position().y+this.root.elt.offsetHeight);
        clear();
        drawLines(root);
        console.log("HEIGHT");
        console.log(this.root.elt.offsetHeight);
    }

    addChild(){
        let newChild = new ADTree("Child");
        this.children.push(newChild);
        if (this.children.length == 1){
            this.children[this.children.length-1].root.position(this.oldX, this.oldY + 200 + this.root.elt.offsetHeight);
        } else {
            for (let i = 0; i < this.children.length-1; i++){
                this.children[i].root.position(this.children[i].root.x - 175, this.oldY + 200 + this.root.elt.offsetHeight);
            }
            this.children[this.children.length-1].root.position(this.oldX + 175*(this.children.length-1), this.oldY + 200 + this.root.elt.offsetHeight);
        }
        this.root.elt.focus();
        clear();
        drawLines(root);
    }

    toggleContextMenu(){
        if (this.contextEnabled){ // If contextMenu is enabled, it should disable when toggled. So delete all btns
            console.log("TOGGGLE CONTEXT")
            this.Plusbtn.remove();
            this.Refinebtn.remove();
            this.AtkDefBtn.removeAttribute("data-feather");
            feather.replace();
            this.AtkDefBtn.remove();
        } else {                  // ELSE, buttons are not currently active, create them

            // Create the plus button
            this.Plusbtn = createButton("+");
            this.Plusbtn.position(this.root.position().x+this.root.elt.offsetWidth/2 - this.Plusbtn.width/2, this.root.position().y+this.root.elt.offsetHeight);
            this.Plusbtn.addClass('contextAddChild');
            this.Plusbtn.mousePressed(this.addChild.bind(this));
            
            // Create refinedment (AND/OR) button
            if (this.refinementIsAnd)
                this.Refinebtn = createButton("OR");
            else 
                this.Refinebtn = createButton("AND");
            this.Refinebtn.position(this.root.position().x+this.root.elt.offsetWidth/2 - this.Plusbtn.width/2, this.root.position().y-this.Refinebtn.elt.offsetHeight);
            this.Refinebtn.addClass('contextRefine');
            this.Refinebtn.mousePressed(() => {
                this.refinementIsAnd = !this.refinementIsAnd;
                clear();
                drawLines(root);
                if (this.refinementIsAnd)
                    this.Refinebtn.elt.innerHTML = "OR";
                else 
                    this.Refinebtn.elt.innerHTML = "AND";
            });

            // Create defense/attack toggle
            this.AtkDefBtn = createButton("");
            if (this.isDefense)
                this.AtkDefBtn.attribute("data-feather","shield");
            else 
                this.AtkDefBtn.attribute("data-feather","shield-off");
            this.AtkDefBtn.position(this.root.position().x+this.root.elt.offsetWidth/2 + this.Refinebtn.elt.offsetWidth - this.Plusbtn.width/2, this.root.position().y-this.Refinebtn.elt.offsetHeight);
            this.AtkDefBtn.addClass('atkDef');
            this.AtkDefBtn.mousePressed(() => {
                this.isDefense = !this.isDefense;
                console.log("DEFENSE IS " + this.isDefense);
                if (!this.isDefense)
                    this.AtkDefBtn.attribute("data-feather","shield");
                else 
                    this.AtkDefBtn.attribute("data-feather","shield-off");
                feather.replace();
                });
            feather.replace();
        }
        this.contextEnabled = !this.contextEnabled; // Toggle contextEnabled bool
    }

    focusing(){
    }

    unfocusing(){
    }

    inputPressed(){
        console.log(mouseX + canvasElement.position().x, mouseY + canvasElement.position().y, this.root.position().x, this.root.position().y)
        this.oldX = this.root.x;
        this.oldY = this.root.y;
        if (active != this){
            active = this;
            if (lastActive != null && lastActive != canvasElement)
                lastActive.toggleContextMenu();
            lastActive = this;
            this.toggleContextMenu();
            this.root.style("border", "2px solid #FF6464");
        }
    }

    inputReleased(){
        this.toggleContextMenu();
        this.isDragging = false;
        this.oldX = this.root.x;
        this.oldY = this.root.y;
        this.root.elt.focus();
    }

    setPos(X,Y){
        if (this.isDragging == true){
            this.root.position(canvasElement.position().x+X-this.root.elt.offsetWidth/2,canvasElement.position().y+Y-this.root.elt.offsetHeight/2);
            this.Plusbtn.position(this.root.position().x+this.root.elt.offsetWidth/2 - this.Plusbtn.width/2, this.root.position().y+this.root.elt.offsetHeight);
        } else {
            if (
                mouseX + canvasElement.position().x < this.oldX-10 ||
                mouseX + canvasElement.position().x > this.oldX+this.root.elt.offsetWidth+10 ||
                mouseY + canvasElement.position().y < this.oldY-10 ||
                mouseY + canvasElement.position().y > this.oldY+this.root.elt.offsetHeight+10
            ){
                this.toggleContextMenu();
                this.isDragging = true;
                this.root.elt.blur();
                active = this;
                lastActive = this;
            }
        }
        
        
    }
}