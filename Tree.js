class ADTree{
    // Constructor ADTree
    constructor(inputVal){
        this.name = "ROOT NODE!";
        this.root;
        if (inputVal == null) { // if input NOT given, use nodeChildTextInput. Else, use input.
            let textVal = select("#nodeChildTextInput").elt.value;
            if (!textVal) // if nodeChildTextInput empty, use placeholder
                root = createInput("Placeholder");
            else
                root = createInput(textVal);
        } else {
            root = createInput(inputVal);
        } 
        root.addClass('Node'); // add styling
        root.position(canvasElement.position().x, canvasElement.position().y) // set pos to top-left of canvas
        root.mouseClicked(this.runtest.bind(this));
        root.elt.addEventListener('focus', this.focusing.bind(this))
        root.elt.addEventListener('blur', this.unfocusing.bind(this))

    }

    // addChild(inputNode){
    //     // this.children.push(inputNode)
    // }
    runtest(){
        console.log("test succesful");
        console.log(this.name);
    }
    focusing(){
        console.log("focusing");
        
    }
    unfocusing(){
        console.log("unfocusing");
        console.log(this.name);
    }
}