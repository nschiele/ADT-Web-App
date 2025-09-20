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
        this.level = 0;
        this.xmlNode = null;
        // Buttons
        let Plusbtn = null;
        let Refinebtn = null;
        let AIbtn = null;
        let AtkDefBtn = null;
        let DeleteBtn = null;
        this.oldX = width / 2 + cX;
        this.oldY = height / 8 + cY;
        this.unmoved = true;
        if (inputVal == null)
            this.root = createSpan("");
        else
            this.root = createSpan(inputVal);
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
        if (active == this) {  // Pin the PlusBtn to the bottom of the active node, even when the node expands when written in
            this.Plusbtn.position(this.root.position().x + this.root.elt.offsetWidth / 2 - this.Plusbtn.width / 2, this.root.position().y + this.root.elt.offsetHeight);
            this.AIbtn.position(this.root.position().x + this.root.elt.offsetWidth / 2 + this.Plusbtn.width / 2, this.root.position().y + this.root.elt.offsetHeight);
        }
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
    
    positionNewChild(newChild){
        // Loops over children to detemine how many haven't been moved, and places the next
        // child a bit off to the right and below the last unmoved child. If all moved already,
        // it is simply placed 200 px below the parent.
        let baseX = this.root.position().x;
        let baseY = this.root.position().y;
        if (this.children.length > 1){
            for (const child of this.children){
                if (child.unmoved && child.root.y >= baseY){
                    baseX = child.root.x;
                    baseY = child.root.y;
                }
            }
            newChild.root.position(baseX + 50, baseY + 50);
        } else {
            newChild.root.position(baseX, baseY + this.root.elt.offsetHeight + 200);
        }
    }

    addChild(name = null, defType = null) {
        let newChild;
        if (name == null){
            if (this.isDefense)
                newChild = new ADTree("Defense node");
            else
                newChild = new ADTree("Attack node");
        }
        else{
            newChild = new ADTree(name);
        }
        newChild.parent = this;
        if (defType == null){
            newChild.isDefense = this.isDefense;
        } else {
            newChild.isDefense = defType;
        }
        newChild.level = this.level+1;
        if (newChild.isDefense)
            newChild.root.addClass('NodeInactiveDef'); // add Def styling
        else
            newChild.root.addClass('NodeInactiveAtk'); // add Atk styling
        this.children.push(newChild);
        allNodes.push(newChild);
        this.positionNewChild(newChild)
        // newChild.root.position(this.root.position().x, this.root.position().y + 200 + this.root.elt.offsetHeight);
        this.root.elt.focus();
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
            this.AIbtn.remove();
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
            this.Plusbtn.position(this.root.position().x + this.root.elt.offsetWidth / 2 - this.Plusbtn.width / 2 - 15, this.root.position().y + this.root.elt.offsetHeight);
            this.Plusbtn.mouseClicked(() => this.addChild());

            // Create the AI button
            this.AIbtn = createButton("AI");
            this.AIbtn.parent('canvasContainer');
            this.AIbtn.addClass('contextAddChild');
            this.AIbtn.position(this.root.position().x + this.root.elt.offsetWidth / 2 + this.Plusbtn.width / 2, this.root.position().y + this.root.elt.offsetHeight);
            this.AIbtn.mouseClicked(() => {
                // console.log(this.root.elt.innerHTML)
                generate(this.root.elt.innerHTML, this);

            });

            // Create refinedment (AND/OR) button
            if (this.refinementIsAnd)
                this.Refinebtn = createButton("OR");
            else
                this.Refinebtn = createButton("AND");
            this.Refinebtn.parent('canvasContainer');
            this.Refinebtn.addClass('contextRefine');
            this.Refinebtn.position(this.root.position().x + this.root.elt.offsetWidth / 2 - this.Plusbtn.width / 2 - 15, this.root.position().y - this.Refinebtn.elt.offsetHeight); // TODO: WEIRD CSS BUG (+9????)
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
        this.AtkDefBtn.addEventListener('click', () => {
            this.clickedAtkDef();
        });
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
            this.unmoved = false;
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

// GPT3 is old! Why not use GPT5?
function generate(label, node) {
    console.log("Calling GPT3")
    var url = "https://api.openai.com/v1/chat/completions";
    var bearer = 'Bearer ' + AI_token

    //This part generates this children
    prompt = "You are helping cybersecurity analysis break "
    if (node.isDefense) {
        prompt += "defense"
    } else {
        prompt += "attack"
    }
    prompt += " goals and components into their component parts for analysis.  Please provide 3 sub-components or sub-goals in service of " + label + ". "
    if (node.refinementIsAnd) {
        prompt += " All sub-component or sub-goals should will need to be completed for the overall goal to be competed."
    } else {
        prompt += " Only one sub-component or sub-goals should will need to be completed for the overall goal to be competed."
    }
    prompt += " Make each sub-component or sub-goal no longer than 10 words. Do not elaborate."
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{ "role": "user", "content": prompt }]

        })


    }).then(response => {

        return response.json()

    }).then(data => {
        console.log(data)
        console.log(typeof data)
        console.log(data.choices)
        console.log(data.choices[0])
        console.log(data.choices[0].message)
        console.log(data.choices[0].message.content, label)
        console.log(typeof data.choices)
        console.log(Object.keys(data))
        console.log(data['choices'][0].text)
        let response = data.choices[0].message.content
        console.log(response)
        const re = /[0-9]\. /i;
        // let response = "1. Identify and exploit vulnerabilities in the bank's physical security systems, such as alarms, locks, and surveillance cameras. 2. Gain unauthorized access to the bank's computer network and systems, in order to bypass digital security measures and obtain valuable information or funds. 3. Maintain stealth and covertness throughout the operation to minimize the risk of detection by security personnel or law enforcement."
        response = response.split(re)
        console.log(response)
        for (let i = 1; i < 4; i++) {
            node.addChild(response[i])
        }

    })
        .catch(error => {
            console.log('Something bad happened ' + error)
        }).then(data => {    //This part generates the countermeasure
            prompt = "You are helping cybersecurity analysis break "
            if (node.isDefense) {
                prompt += "defense"
            } else {
                prompt += "attack"
            }
            prompt += " goals and components into their component parts for analysis."
            if (node.isDefense) {
                prompt += " Provide one way to attack the goal or component: " + label
            } else {
                prompt += " Provide one way to defend against the goal or component: " + label
            }
            prompt += " Make your suggested"
            if (node.isDefense) {
                prompt += " attack"
            } else {
                prompt += " defense"
            }
            prompt += " no more than 10 words. Do not elaborate"
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": [{ "role": "user", "content": prompt }]

                })


            }).then(response => {

                return response.json()

            }).then(data => {
                console.log(data)
                console.log(typeof data)
                console.log(data.choices)
                console.log(data.choices[0])
                console.log(data.choices[0].message)
                console.log(data.choices[0].message.content, label)
                console.log(typeof data.choices)
                console.log(Object.keys(data))
                console.log(data['choices'][0].text)
                let response = data.choices[0].message.content
                if (node.isDefense) {
                    node.addChild(response, false)
                } else {
                    node.addChild(response, true)
                }

            })
                .catch(error => {
                    console.log('Something bad happened ' + error)
                });
        });

                                                                               
                                                                                                   

}

