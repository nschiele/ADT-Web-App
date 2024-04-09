class ADTree {
    // Constructor ADTree
    constructor(inputVal) {
        let parent = null;
        this.children = [];
        this.root;
        this.refinementIsAnd = false;
        this.isDefense = false;
        this.isDragging = false;
        this.contextEnabled = false;
        this.movedChildren = false;
        this.level = 0;
        this.xmlNode = null;
        // Buttons
        let Plusbtn = null;
        let Refinebtn = null;
        let AtkDefBtn = null;
        let DeleteBtn = null;
        this.oldX = width / 2 + cX;
        this.oldY = height / 8 + cY;
        if (inputVal == null) { // if input NOT given, use nodeChildTextInput. Else, use input.
            let textVal = select("#nodeChildTextInput").elt.value;
            if (!textVal) { // if nodeChildTextInput empty, use placeholder
                this.root = createSpan("Placeholder"); // placeholder
            }
            else {
                this.root = createSpan(textVal); // textval
            }
        } else {
            this.root = createSpan(inputVal); // inputval
        }
        this.root.attribute('contenteditable', 'true');
        this.root.attribute('role', 'textbox');
        this.root.position(this.oldX - 150, this.oldY) // set pos to top-left of canvas
        this.root.elt.style.width = standardWidth * scalar + "px";
        if ( scalar == 1){
            this.root.elt.style.fontSize = standardFontSize * scalar + "rem";
        } else {
            this.root.elt.style.fontSize = standardFontSize * scalar * 0.97 + "rem";
        }
        this.root.elt.addEventListener('mousedown', this.inputPressed.bind(this))
        this.root.elt.addEventListener('mouseup', this.inputReleased.bind(this))
        this.root.elt.addEventListener('input', this.resizeInputBox.bind(this))
    }

    resizeInputBox() { // Called when someone types into a node
        if (active == this) // Pin the PlusBtn to the bottom of the active node, even when the node expands when written in
            this.Plusbtn.position(this.root.position().x + this.root.elt.offsetWidth / 2 - this.Plusbtn.width / 2, this.root.position().y + this.root.elt.offsetHeight);
        // Scale width to new width
        this.root.elt.style.width = standardWidth * scalar + "px";
        // If not rescaled, use standard fontsize. Otherwise, use modified scalar that works a little better with fontsize (0.97 is arbitraty and just kinda works)
        if ( scalar == 1){
            this.root.elt.style.fontSize = standardFontSize * scalar + "rem";
        } else {
            this.root.elt.style.fontSize = standardFontSize * scalar * 0.97 + "rem";
        }
        clear();
        drawLines(root);
    }

    deleteSubTree() {
        for (let i = this.children.length - 1; i >= 0; i--) {
            this.children[i].deleteSubTree();
        }
        if (active == this)
            this.toggleContextMenu();
        this.root.remove();
        if (this.parent != null)
            for (let i = 0; i < this.parent.children.length; i++) {
                if (this.parent.children[i] == this) {
                    delete this.parent.children[i];
                }
            }
    }

    parentDeleteSubTree(i) {
        this.children[i].deleteSubTree();
        this.children.splice(i, 1);
        clear();
        drawLines(root);
        active = this;
        this.toggleContextMenu();
        treeCheck();
    }
    
    addChild() {
        let newChild = new ADTree("Child" + active.children.length);
        newChild.parent = this;
        newChild.isDefense = this.isDefense
        newChild.level = this.level+1;
        if (newChild.isDefense)
            newChild.root.addClass('NodeInactiveDef'); // add Def styling
        else
            newChild.root.addClass('NodeInactiveAtk'); // add Atk styling
        this.children.push(newChild);
        allNodes.push(newChild);
        if (!this.movedChildren) {
            if (this.children.length == 1) {
                this.children[this.children.length - 1].root.position(this.root.position().x, this.root.position().y + 200 + this.root.elt.offsetHeight);
            } else {
                let j = 0;
                for (let i = 0; i < this.children.length - 1; i++) {
                    if (this.children[i] != undefined) {
                        this.children[i].root.position(this.children[j].root.x - 175, this.oldY + 200 + this.root.elt.offsetHeight);
                        j++;
                    }
                }
                this.children[this.children.length - 1].root.position(this.root.position().x + 175 * (this.children.length - 1), this.oldY + 200 + this.root.elt.offsetHeight);
            }
        } else {
            newChild.root.position(this.root.position().x, this.root.position().y + 200 + this.root.elt.offsetHeight);
        }
        this.root.elt.focus();
        // active.toggleContextMenu();
        // active = newChild;
        // active.toggleContextMenu();
        clear();
        drawLines(root);
    }

    createAtkDefBtn() {
        this.AtkDefBtn = createButton("");
        this.AtkDefBtn.parent('canvasContainer');
        if (this.isDefense) {
            this.AtkDefBtn.attribute("data-feather", "shield");
        }
        else {
            this.AtkDefBtn.attribute("data-feather", "flag");
        }
        this.AtkDefBtn.addClass('atkDef');
        this.AtkDefBtn.position(this.root.position().x + this.root.elt.offsetWidth / 2 + this.Refinebtn.elt.offsetWidth / 2, this.root.position().y - this.Refinebtn.elt.offsetHeight);
        feather.replace();
        let atkdefBtns = document.getElementsByClassName('atkDef');
        this.AtkDefBtn = atkdefBtns[atkdefBtns.length - 1] // Have to re-locate the button, since feather completely replaces the elements it 
        // introduced svgs into. Index 0 since there SHOULD only be 1 button on screen at a time.
        // Loops over all previous instances of the AtkDefBtn and removes them (SHOULD be 1, the last one), but does all but the last just in case :)
        for (let i = 0; i < atkdefBtns.length - 2; i++) {
            atkdefBtns[i].remove();
        }

        // this.AtkDefBtn = document.getElementsByClassName('atkDef')[0];
        this.AtkDefBtn.addEventListener('click', this.clickedAtkDef.bind(this));

    }

    createDeleteBtn() {
        this.DeleteBtn = createButton("");
        this.DeleteBtn.parent('canvasContainer');
        this.DeleteBtn.attribute("data-feather", "x-circle"); // Feather.js icon (feathericons.com)
        this.DeleteBtn.addClass('deleteBtn');
        this.DeleteBtn.position(this.root.position().x + this.root.elt.offsetWidth - this.DeleteBtn.elt.offsetWidth / 3, this.root.position().y - this.DeleteBtn.elt.offsetHeight);
        feather.replace();
        let delBtns = document.getElementsByClassName('deleteBtn');
        this.DeleteBtn = delBtns[delBtns.length - 1] // Have to re-locate the button, since feather completely replaces the elements it 
        // introduced svgs into. Index 0 since there SHOULD only be 1 button on screen at a time.
        // Loops over all previous instances of the DeleteBtn and removes them (SHOULD be 1, the last one), but does all but the last just in case :)
        for (let i = 0; i < delBtns.length - 2; i++) {
            delBtns[i].remove();
        }
        this.DeleteBtn.addEventListener('click', () => {
            if (this.parent != null) {
                for (let i = 0; i < this.parent.children.length; i++)
                    if (this.parent.children[i] == this)
                        this.parent.parentDeleteSubTree(i)

            }
            else {
                for (let i = this.children.length - 1; i >= 0; i--) {
                    this.children[i].deleteSubTree();
                    this.children.splice(i, 1);
                }
                clear();
                drawLines(root);
                treeCheck();
            }


        });
    }

    toggleContextMenu() {
        if (this.contextEnabled) { // If contextMenu is enabled, it should disabled when toggled. So delete all btns
            if (this.isDefense) {
                this.root.removeClass('NodeActiveDef'); // remove active styling
                this.root.addClass('NodeInactiveDef'); // add inactive styling
            } else {
                this.root.removeClass('NodeActiveAtk'); // remove active styling
                this.root.addClass('NodeInactiveAtk'); // add inactive styling
            }
            this.Plusbtn.remove();
            this.Refinebtn.remove();
            this.AtkDefBtn.remove();
            this.DeleteBtn.remove();
        } else {                  // ELSE, buttons are not currently active, create them
            if (this.isDefense) {
                this.root.removeClass('NodeInactiveDef'); // remove active styling
                this.root.addClass('NodeActiveDef'); // add inactive styling
            } else {
                this.root.removeClass('NodeInactiveAtk'); // remove active styling
                this.root.addClass('NodeActiveAtk'); // add inactive styling
            }
            // Create the plus button
            this.Plusbtn = createButton("+");
            this.Plusbtn.parent('canvasContainer');
            this.Plusbtn.addClass('contextAddChild');
            this.Plusbtn.position(this.root.position().x + this.root.elt.offsetWidth / 2 - this.Plusbtn.width / 2, this.root.position().y + this.root.elt.offsetHeight);
            this.Plusbtn.mouseClicked(this.addChild.bind(this));

            // Create refinedment (AND/OR) button
            if (this.refinementIsAnd)
                this.Refinebtn = createButton("OR");
            else
                this.Refinebtn = createButton("AND");
            this.Refinebtn.parent('canvasContainer');
            this.Refinebtn.addClass('contextRefine');
            this.Refinebtn.position(this.root.position().x + this.root.elt.offsetWidth / 2 - this.Plusbtn.width / 2, this.root.position().y - this.Refinebtn.elt.offsetHeight); // TODO: WEIRD CSS BUG (+9????)
            this.Refinebtn.mouseClicked(() => {
                this.refinementIsAnd = !this.refinementIsAnd;
                clear();
                drawLines(root);
                if (this.refinementIsAnd)
                    this.Refinebtn.elt.innerHTML = "OR";
                else
                    this.Refinebtn.elt.innerHTML = "AND";
            });

            // Create defense/attack toggle
            this.createAtkDefBtn();

            // Create delete button
            this.createDeleteBtn();
            disableNonInteractables([this.Plusbtn.elt, this.Refinebtn.elt, this.AtkDefBtn, this.DeleteBtn]);
        }

        this.contextEnabled = !this.contextEnabled; // Toggle contextEnabled bool
    }

    clickedAtkDef() {
        this.isDefense = !this.isDefense;
        clear();
        console.log("cleared")
        drawLines(root);
        this.AtkDefBtn.remove();
        this.AtkDefBtn = createButton("");
        this.AtkDefBtn.parent('canvasContainer');
        this.AtkDefBtn.addClass('atkDef');
        if (this.isDefense) {
            this.AtkDefBtn.attribute("data-feather", "shield");
            this.root.removeClass('NodeActiveAtk');
            this.root.addClass('NodeActiveDef');
        }
        else {
            this.AtkDefBtn.attribute("data-feather", "flag");
            this.root.removeClass('NodeActiveDef');
            this.root.addClass('NodeActiveAtk');
        }
        this.AtkDefBtn.position(this.root.position().x + this.root.elt.offsetWidth / 2 + this.Refinebtn.elt.offsetWidth / 2, this.root.position().y - this.Refinebtn.elt.offsetHeight);
        feather.replace();
        this.AtkDefBtn = document.getElementsByClassName('atkDef')[0];
        this.AtkDefBtn.addEventListener('click', this.clickedAtkDef.bind(this));
        treeCheck();
    }

    inputPressed() {
        allowDragging = true;
        this.oldX = this.root.x;
        this.oldY = this.root.y;
        if (active != null) // If some other node was selected previously, unselect it and select the current node
            active.toggleContextMenu();
        active = this;
        active.toggleContextMenu();

    }

    inputReleased() {
        this.isDragging = false;
        this.oldX = this.root.x;
        this.oldY = this.root.y;
        this.root.elt.focus();
        if (lastActive != null) {
            active = lastActive;
            lastActive = null;
        }
    }

    setPos(X, Y) {
        if (this.isDragging == true) { // Code that is run every 'frame' while dragging
            this.root.elt.blur();
            clearTextSelection();
            this.root.position(canvasElement.position().x + X - this.root.elt.offsetWidth / 2, canvasElement.position().y + Y - this.root.elt.offsetHeight / 2);
            this.toggleContextMenu();
            this.toggleContextMenu();
            if (this.parent) { // Check if not the top node
                this.parent.movedChildren = true;
                let selfIndex = this.parent.children.indexOf(this);
                if (this.parent.children.length > 1 && selfIndex != 0 && calcAngle(this.parent, this.parent.children[selfIndex - 1]) < calcAngle(this.parent, this)) {
                    this.parent.children[selfIndex] = this.parent.children[selfIndex - 1];
                    this.parent.children[selfIndex - 1] = this;
                }
                if (this.parent.children.length > selfIndex + 1 && selfIndex != this.parent.children.length - 1 && calcAngle(this.parent, this.parent.children[selfIndex + 1]) > calcAngle(this.parent, this)) {
                    this.parent.children[selfIndex] = this.parent.children[selfIndex + 1];
                    this.parent.children[selfIndex + 1] = this;
                }
            }
        } else { // Enable dragging
            if ( // If mouse drags atleast 10 pixels outside of the boundary of the node
                mouseX + canvasElement.position().x < this.oldX - 10 ||
                mouseX + canvasElement.position().x > this.oldX + this.root.elt.offsetWidth + 10 ||
                mouseY + canvasElement.position().y < this.oldY - 10 ||
                mouseY + canvasElement.position().y > this.oldY + this.root.elt.offsetHeight + 10
            ) {
                this.isDragging = true;
            }
        }
    }

    convertADTtoNode(parent) {
        var newNode;
        if (this == root) {
            var nodeRoot = new Node();
            nodeRoot.label = this.root.elt.innerHTML;
            nodeRoot.refinement = this.refinementIsAnd;
            nodeRoot.depth = this.level;
            nodeRoot.swith_role = this.isDefense;
            nodeRoot.parent = null;
            newNode = nodeRoot;
            this.xmlNode = nodeRoot;
        } else {
            var ADTnode = new Node();
            ADTnode.label = this.root.elt.innerHTML;
            ADTnode.refinement = this.refinementIsAnd;
            ADTnode.depth = this.level;
            ADTnode.swith_role = this.isDefense;
            ADTnode.parent = this.parent;
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
        return temp_string;
    }
}