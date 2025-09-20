let root; // The first node that is always placed.
let canvasElement; // Holds the canvas, can be used anywhere to point directly to the canvas.
let canvasWidth = 100;
let canvasHeight = 100;
let canvasParentDiv; // Parented to canvas, to give it the correct position in the DOM.
let active = null; // keeps track of CURRENTLY active element. 'null' means that no node is selected, so the canvas is panned.
let lastActive = null; // keeps track of LAST active element. Gets set to active whenever you start dragging on not-a-node, and unset when finished.
let cX = 0; // used to keep track of canvas' location on the page. Used when resizing window, since the 
let cY = 0; // side/top/bottom bars can shrink/grow when resizing, as such moving the absolute position of the canvas.
let mX; // Used to compute distance from mouse. Different from canvasOldX by being used every frame, as opposed to
let mY; // only when having moved a sufficient distance.
let canvasOldX = null; // X and Y are both set when you first click on something that is not a node.
let canvasOldY = null; // That way you can compute how far the cursor has dragged since the click started.
let moveCount = 0; // Incrementer used to not redraw elements on every frame
let allowDragging = false;
let redrawLines = false;
let refinementDist = 0.3;
let scalar = 1;
let standardWidth = 300;
let standardFontSize = 0.875; // 0.875 rem
let AI_token = "";

let CMOverflow = false;

let allNodes = [];

async function setup() { // Only called once: https://p5js.org/reference/#/p5/setup
    toDraw = true;
    trackMouseStart = true;
    frameRate(60);
    sideFrameWidth = 400;
    var frameX = windowWidth - sideFrameWidth; // Calculate how big the canvas should be, by compensating for the non-canvas side elements.
    var canvasParentDiv = document.getElementById('canvasContainer');
    // set initial height and width for the canvas (will be resized to fit full screen.)
    canvasElement = createCanvas(canvasWidth, canvasHeight);
    noSmooth(); // Removes rounded corners (to properly fill the canvas area)
    // Parent the canvas to the container DIV, this properly places it within the DOM
    canvasElement.parent("canvasContainer");
    // When canvas (or anything that is not a node, like side/top/bottom bars) is clicked, setup to pan the canvas, as opposed to moving a node
    let nonInteractableElements = [
        document.getElementById("topBar"),
        canvasElement.elt,
        document.getElementById("canvTopBar"),
        document.getElementById("botFooter")
    ];
    disableNonInteractables(nonInteractableElements);

    /* windowWidth/Height is in pixels; the width and height of window (not the entire display, just the html DOM!)
      * sticky-top is the class of the top bar. canvTopBar is the id of the buttons right above the canvas. (zoom in, out, export, import, etc.). 
      * The heights of these elements are considered when setting canvas position and dimensions.
      */
    select("#canvTopBar").position(0, select("#topBar").offsetHeight);
    canvasElement.position(0, select("#topBar").offsetHeight + select("#canvTopBar").offsetHeight + 26);

    cX = canvasElement.position().x;
    cY = canvasElement.position().y;
    resizeCanvas(windowWidth - cX, windowHeight - cY - document.getElementById('botFooter').offsetHeight);
    // Canvas and line styling
    noSmooth();
    canvasElement.elt.style.borderRadius = "0";
    stroke('darkgray');
    strokeWeight(2);
    background('white');

    // Initialize canvas with 1 node
    root = new ADTree("Target");
    allNodes.push(root);
    active = root;
    active.toggleContextMenu();
    // Replace temporary node with a pre-loaded tree
    // let url = "https://raw.githubusercontent.com/nschiele/ADT-Web-App/main/xml%20examples/fig13.xml";
    // let resp = await fetch(url);
    // var example = await getJson(0, resp); // Call json_junc.js
    // buildFromMultiset(example);

    let warningIcon = document.getElementById('btn-groupwarningIcon');
    warningIcon.addEventListener('click', setupWarningMessages)

    // Tell the canvas to translate all given coordinates to be related to the entire window, not just the canvas. 
    // (so (0,0) is top left of the window, not the canvas. Helps with calculations later.)
    translate(-cX, -cY);
style('display', 'flex')
    select(".aiDivCloseButton").style('display', 'block')
    select(".aiDivInput").style('display', 'flex')
    select(".aiDivButton").style('display', 'inline-block')

    select(".aiDivCloseButton").elt.addEventListener('click', () => {
        // Clean up when clicking out of notification box
        closeWindows();
    })
}

function setStyle() {
    console.log("setting style")
    closeWindows();
    select(".styleDiv").poewjkflwsition(select("#topBar").offsetHeight, 0);
    select(".styleDiv").style('display', 'flex')
    select(".styleDivBody").style('display', 'flex')
    select(".styleDivCloseButton").style('display', 'block')
    select(".styleDivButton").style('display', 'inline-block')

    select(".styleDivCloseButton").elt.addEventListener('click', () => {
        // Clean up when clicking out of notification box
        closeWindows();
    })
}

function updateStyle() {
    console.log(document.getElementById('styleRange').value);
    standardWidth = document.getElementById('styleRange').value;
    console.log(root);
    rescaleTree(root, true);
    rescaleTree(root, false);

}


function createFromXML(){
    console.log("Creating xml")
    closeWindows();
    select(".adtlangDiv").position(select("#topBar").offsetHeight, 0);
    select(".adtlangDiv").style('display', 'flex')
    select(".adtlangDivBody").style('display', 'flex')
    select(".adtlangDivCloseButton").style('display', 'block')
    select(".adtlangDivInput").style('display', 'flex')
    select(".adtlangDivButton").style('display', 'inline-block')

    select(".adtlangDivCloseButton").elt.addEventListener('click', () => {
        // Clean up when clicking out of notification box
        closeWindows();
    })

}

function closeWindows() {
    select(".adtlangDiv").style('display', 'none')
    select(".adtlangDivBody").style('display', 'none')
    select(".adtlangDivCloseButton").style('display', 'none')
    select(".adtlangDivInput").style('display', 'none')
    select(".adtlangDivButton").style('display', 'none')


    select(".styleDiv").style('display', 'none')
    select(".styleDivBody").style('display', 'none')
    select(".styleDivCloseButton").style('display', 'none')
    select(".styleDivButton").style('display', 'none')

    select(".aiDiv").style('display', 'none')
    select(".aiDivBody").style('display', 'none')
    select(".aiDivCloseButton").style('display', 'none')
    select(".aiDivButton").style('display', 'none')
}




let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0;



// This is currently unused due to html2canvas being bad.
function saveScreenshot() {
    const captureElement = document.querySelector('body') // Select the element you want to capture. Select the <body> element to capture full page.
    html2canvas(captureElement)
        .then(canvas => {
            canvas.style.display = 'none'
            document.body.appendChild(canvas)
            return canvas
        })
        .then(canvas => {
            const image = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.setAttribute('download', 'my-image.png')
            a.setAttribute('href', image)
            a.click()
            canvas.remove()
        })
  }

function manAddChild(inputVal) { // Manually add a child, inputVal is a string to be given as the text-content of the created node.
    childTree = new ADTree(inputVal);
    childTree.root.addClass('NodeActiveAtk')
}

function drawLines(node) { // Recursively draw all lines between all nodes and their children
    let lastFoundSameTypeChildIndex = null;
    for (let i = 0; i < node.children.length; i++) {
        if (node.children[i] && node.children[i].isDefense != node.isDefense)
            drawingContext.setLineDash([5]);
        // Draw line between root of sub-tree and child i
        line(node.root.x + node.root.elt.offsetWidth / 2, node.root.y + node.root.elt.offsetHeight, node.children[i].root.x + node.children[i].root.elt.offsetWidth / 2, node.children[i].root.y);
        // recursively call drawLines on sub-trees
        drawingContext.setLineDash([]);
        drawLines(node.children[i]);
        if (node.refinementIsAnd)
            if (node.children[i].isDefense == node.isDefense) {
                if (lastFoundSameTypeChildIndex != null) {
                    line(node.root.x + node.root.elt.offsetWidth / 2 + ((node.children[lastFoundSameTypeChildIndex].root.x + node.children[lastFoundSameTypeChildIndex].root.elt.offsetWidth / 2) - (node.root.x + node.root.elt.offsetWidth / 2)) * refinementDist, // middle of current node - 1/10th x-distance to left node of current pair
                        node.root.y + node.root.elt.offsetHeight + (node.children[lastFoundSameTypeChildIndex].root.y - (node.root.y + node.root.elt.offsetHeight)) * refinementDist,  // bottom of current node - 1/10th u-distance to top of left node of current pair
                        node.root.x + node.root.elt.offsetWidth / 2 + ((node.children[i].root.x + node.children[i].root.elt.offsetWidth / 2) - (node.root.x + node.root.elt.offsetWidth / 2)) * refinementDist,  // middle of current node - 1/10th distance to right node of current pair
                        node.root.y + node.root.elt.offsetHeight + (node.children[i].root.y - (node.root.y + node.root.elt.offsetHeight)) * refinementDist)  // bottom of current node - 1/10th distance to top of left node of current pair
                }
                lastFoundSameTypeChildIndex = i; // Keep track of last found non-CounterMeasure child
            }
    }
}

function moveNodes(node, moveX, moveY) { // Moves all nodes in tree
    node.root.position(node.root.position().x + moveX, node.root.position().y + moveY); // Move node by moveX and moveY
    if (node.contextEnabled) {
        node.toggleContextMenu();
        node.toggleContextMenu();
    }
    node.oldX = node.root.x;
    node.oldY = node.root.y;
    for (let i = 0; i < node.children.length; i++) {
        // recursively call moveNodes on sub-trees
        moveNodes(node.children[i], moveX, moveY);
    }
}

function disableNonInteractables(listOfElements) {
    for (let i = 0; i < listOfElements.length; i++) { // loop over nonInteractables
        // Handle click DOWN
        console.log(i)
        listOfElements[i].addEventListener('mousedown', (event) => // when clicked DOWN, unset active. And store the old active in lastActive
        {  
            allowDragging = false;
            if (event.button === 0){
                mX = mouseX;
                mY = mouseY;
                canvasOldX = mouseX;
                canvasOldY = mouseY;
                allowDragging = (listOfElements[i] == canvasElement.elt); // Allow dragging only if dragging the canvas, so non-canvas elts
                // are ignored
                if (allowDragging) {
                    lastActive = active;
                    active = null;
                }
            }
            
        });
        // Handle click UP
        listOfElements[i].addEventListener('mouseup', (event) =>  // when clicked UP (released click), set active back to old active like nothing happened.
        {
            if (event.button === 0){
                if (allowDragging) {
                    if (lastActive != null)
                        active = lastActive;
                    lastActive = null;
                }
                if (listOfElements[i] == canvasElement.elt && mouseX == canvasOldX && mouseY == canvasOldY) {
                    if (lastActive != null)
                        lastActive.toggleContextMenu();
                    if (active != null)
                        active.toggleContextMenu();
                    lastActive = null;
                    active = null;
                }
            }
        });

    }
}

function setupWarningMessages() { // Handles behaviour when clicking warning icon
    let warningsDiv = createDiv();
    warningsDiv.addClass('warningDiv');
    warningsDiv.position(select("#topBar").offsetHeight, 0);

    let warningsDivBody = createDiv();
    warningsDivBody.addClass('warningDivBody');
    warningsDiv.position(select("#topBar").offsetHeight, 0);
    warningsDivBody.parent(warningsDiv);

    let ErrorPElements = [];
    // Create error header and apply styling
    let mainP = createP('One or more nodes have an error, the current tree is wrong.');
    mainP.parent(warningsDivBody);
    mainP.addClass('ErrorHeading');
    // Counter-measure overflow message
    if (CMOverflow) {
        let CMOP = createP('Too many counter-measures per node. Counter-measures are nodes of a different type than their parent node.')
        CMOP.parent(warningsDivBody);
        ErrorPElements.push(CMOP);
    }
    // Apply styling to all error messages
    for (const child of ErrorPElements) {
        child.addClass('ErrorMessage');
    }

    warningsDiv.elt.addEventListener('click', () => {
        // Clean up when clicking out of notification box
        for (const element of ErrorPElements) {
            element.remove();
        }
        mainP.remove();
        warningsDivBody.remove();
        warningsDiv.remove();
    })

}

function treeCheck() { // Should be called whenever something happens that can cause an error (like toggle atk/def of a node)
    // Errors / warnings list initialization:
    CMOverflow = false; // Error: Counter-measure overflow (>1 counter-measure)


    // Run check with error list
    subtreeCheck(root, CMOverflow);

    //Display errors
    if (CMOverflow) {
        document.getElementById('btn-groupwarningIcon').style.display = 'block';
    } else {
        document.getElementById('btn-groupwarningIcon').style.display = 'none';
    }
}

function subtreeCheck(node) {
    let counterMeasures = []; // List of counter-measures for current node (if len > 1, CMOverflow)


    //  Setup for error checks
    // Setup CMOverflow
    for (const child of node.children) {
        child.root.removeClass('ErrorNode'); // Assume no errors, then recheck tree
        if (child.isDefense != node.isDefense)
            counterMeasures.push(child);
    }
    //  Execute error checks
    // Check CMOverflow
    if (counterMeasures.length > 1) {
        for (const errorChild of counterMeasures)
            errorChild.root.addClass('ErrorNode');

        CMOverflow = true;
    }

    // Continue with subtrees
    for (const child of node.children)
        subtreeCheck(child)
}

function mouseDragged(event) { // Called when mouse is clicked and dragged, standard in p5: https://p5js.org/reference/#/p5/mouseDragged
    if (allowDragging && mouseButton === LEFT){
        if (active == null) { // If nothing is active, the user is scrolling the canvas
            if ((canvasOldX - mouseX) > 25 || (canvasOldX - mouseX) < -25 || (canvasOldY - mouseY) > 25 || (canvasOldY - mouseY) < -25) {
                canvasOldX = -100; // Once any dragging has occured (user dragged far enough), stop keeping track of where drag started. Otherwise, whenever you move cursor back
                canvasOldY = -100; // into the starting area of the drag, it momentarily stops dragging. By moving off screen, cursor is always outside margin once dragging starts.
                clearTextSelection();
                moveNodes(root, event.movementX, event.movementY);
                clear();
                drawLines(root);
                mX = mouseX;
                mY = mouseY;
            }
        } else { // if a node is active, drag around the node
            clear();              // Clears all drawn pixels off the canvas
            drawLines(root);      // Recurively re-draw lines every frame while dragging (as inneficient as it is, you can't re-draw an individual line while dragging)
            active.setPos(mouseX, mouseY);
        }

    }    
}

function clearTextSelection() { // Deselects any text that the user has selected, prevents awkward text selection while dragging nodes 
    // (I doubt that anyone using this tool will be using Internet Explorer, let alone IE8. Extra checks added just in case though.)
    if (window.getSelection) {  // All modern browsers and IE9+
        if (window.getSelection().empty) {  // Chrome, Firefox, Safari, Opera
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // IE9+
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {  // IE8 and below
        document.selection.empty();
    }
}

function calcAngle(main, sub) {
    return ((Math.atan2(sub.root.x - main.root.x, main.root.y - sub.root.y) * (180 / Math.PI) + 360) % 360);

}

function rescaleTree(node, growing) {
    // Rescale the distance of nodes from the center
    let distanceScalar;
    if (growing)
        distanceScalar = 1.1;
    else
        distanceScalar = 0.9;

    let canvasCenterX = canvasElement.position().x+canvasElement.elt.offsetWidth/2;
    let canvasCenterY = canvasElement.position().y+canvasElement.elt.offsetHeight/2;
    let distanceX = node.root.x - canvasCenterX;
    let distanceY = node.root.y - canvasCenterY;
    node.root.position(canvasCenterX + distanceX * distanceScalar, canvasCenterY + distanceY * distanceScalar);

    // Rescale styling (size of  nodes)
    node.resizeInputBox();
    if (node == active) {
        node.toggleContextMenu();
        node.toggleContextMenu();
    }

    for (const child of node.children) {
        rescaleTree(child, growing);
    }
}

function zoomIn() {
    scalar = scalar * 1.1;
    rescaleTree(root, true)
}

function zoomOut() {
    if (scalar > 0.55){
        scalar = scalar * 0.9;
        rescaleTree(root, false);
    }
}

function autoFormat() {
    autoFormatTree(root);
    clear();
    drawLines(root)
}

function autoFormatTree(rootNode) {
    console.log(standardWidth)
    console.log(int(standardWidth) + 50)
    // TO-DO: Write documentation
    // This whole thing is a thesis of its own im not gonna lie
    let totalChildren = 0;
    let childWidths = [];
    let cumulativeChildWidths = [];
    let childrenWithChildren = [];
    let widthOffset = int(standardWidth) + 50
    if (rootNode.children.length > 0){
        for (let i = 0; i < rootNode.children.length; i++){
            let childCountSubTree = autoFormatTree(rootNode.children[i])
            if (rootNode.children[i].children.length > 0)
                childrenWithChildren.push(true)
            else
                childrenWithChildren.push(false)
            if (i > 0){
                cumulativeChildWidths.push(childCountSubTree * widthOffset + cumulativeChildWidths[i - 1]);
            } else {
                cumulativeChildWidths.push(childCountSubTree * widthOffset);
            }
            childWidths.push(childCountSubTree * widthOffset);
            totalChildren += childCountSubTree
        }
        // moving
        for (let i = 0; i < rootNode.children.length; i++){
            let child = rootNode.children[i];
            if (i == 0){
                let offset = -(cumulativeChildWidths[cumulativeChildWidths.length-1]/2);
                relPosX = rootNode.root.x + (offset + (childWidths[i] - widthOffset) / 2 + widthOffset / 2) * scalar;
                currPosX = child.root.x;
                XDifference = relPosX - currPosX;
                relPosY = rootNode.root.y + rootNode.root.elt.offsetHeight + 200*scalar;
                YDifference = relPosY - child.root.y;
                moveNodes(child, XDifference, YDifference);
            } else {
                let offset = -(cumulativeChildWidths[cumulativeChildWidths.length-1]/2) + cumulativeChildWidths[i-1];
                relPosX = rootNode.root.x + (offset + (childWidths[i] - widthOffset) / 2 + widthOffset / 2) * scalar;
                currPosX = child.root.x;
                XDifference = relPosX - currPosX;
                relPosY = rootNode.root.y + rootNode.root.elt.offsetHeight + 200*scalar;
                YDifference = relPosY - child.root.y;
                moveNodes(child, XDifference, YDifference);
            }
        }
        return totalChildren;
    } else {
        return 1;
    }
    
}

function downloadADT(selectedFormat) {
    return new Promise(function(resolve) {
        root.convertADTtoNode(null);

        var parser = new DOMParser();
        var temp_string = '<?xml version="1.0"?>'
        temp_string += '\n';
        temp_string += '<adtree>';
        var xml = null;
        temp_string = root.addChildInXML(temp_string);
        temp_string += '\n';
        temp_string += '</adtree>';
        xml = parser.parseFromString(temp_string, "text/xml");
        resolve(temp_string);
    });
}

async function downloadPrep() {
    // var selectedFormat = document.getElementById("formatDropdown").value;
    var selectedFormat = "xml";
    try {
      var file = await downloadADT(selectedFormat);
      var input;
      input = file;
      var blob = new Blob([input], { type: "text/plain"});
      var downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "SavedADT." + selectedFormat;
      if (document.getElementById('btn-groupwarningIcon').style.display == 'block')
        alert("Caution! You are trying to download a tree that is incorrect. This tree likely will not be compatible with other ADTree related software.")
      downloadLink.click();
    } catch(error) {
        console.error("Error:", error);
    }
}

function keyPressed() { // Temporary: bind anything to happen when clicking left arrow, for debugging
    if (keyCode == LEFT_ARROW) {
        console.log(root)
    }
    if (keyCode == RIGHT_ARROW) {
        let sub = active;
        let main = root;
        console.log((Math.atan2(sub.root.y - main.root.y, sub.root.x - main.root.x) * (180 / Math.PI) + 360) % 360);
    }
}

function uploadADT() {
    return new Promise(function(resolve, reject) {
      var ADTInput = document.getElementById('ADTInput');
      ADTInput.click();
      ADTInput.addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (file) {
          var fileName = file.name;
          var fileExt = fileName.split('.').pop();

          if (fileExt === 'xml') {
              resolve(file);
          } else {
              reject(new Error("Unsupported file type"));
          }
        } else {
            reject(new Error("No file selected"));
        }
      });
    });
}

async function buildFromUpload() {
    try {
        var file = await uploadADT();
        var fileExt = file.name.split('.').pop();
        var input;
        if (fileExt === 'xml') {
            input = await getJson(0, file);
        }
        buildFromMultiset(input);
    } catch(error) {
        console.error("Error:", error);
    }
    autoFormat();
}

async function buildFromMultiset(toBuild, parent=null){
    // First Run of Function
    if(parent == null){
        root.deleteSubTree();
        root.root.remove();
        root = new ADTree(toBuild[0].label); // Get label of root
        if (active != null)
            active.toggleContextMenu();
        active = root;
        active.toggleContextMenu();

        root.refinementIsAnd = toBuild[0].refinement;
        root.isDefense = toBuild[0].swith_role;

        // Make defense node the last node in the JSON.
        for(let i = 0; i < Object.keys(toBuild[0]).length-6; i++){ // Loop through all children
            buildFromMultiset(toBuild[0][i], root);
        }

    // Tree Exists, adding subtrees
    } else {
      if(!(toBuild === null || toBuild === undefined) && Object.keys(toBuild).length-7 != 0){ // This was 6, with 7 it works, because 7 array elements for normal intermediate node
            parent.addChild(toBuild.label, toBuild.swith_role);
            parent.children[parent.children.length-1].refinementIsAnd = toBuild.refinement;

            // Make defense node the last node in the JSON.
            for (let i = 0; i < (Object.keys(toBuild).length-7); i++){ // Loop through all children
                buildFromMultiset(toBuild[i], parent.children[parent.children.length-1]);
            }

      //Leaf Node
      } else if (!(toBuild == null || toBuild == undefined)){
            parent.addChild(toBuild.label, toBuild.swith_role);
        }
    }
    autoFormat()
}
function isConsentGiven() {
    console.log("[*] In isConsentGiven()");
  
    var message = "Do you consent to your tree being used in scientific research? \n\n" 
        + "The research is focused on the evaluation of ADT usage. \n We will collect your username, the tree name, the token and your tree as a whole.\n"
        + "Findings from this research will be published fully anonymized.\n\n"
     + "Please note that if you do not consent uploading to the server is NOT possible. You can still download your tree to local storage."
    if(confirm(message) == true) {
      return(true);
    }
    else {
      alert("No consent given; tree NOT uploaded to server.")
      return (false);
    }
  }
  
  function isInputlengthWithinLimit(limit, string) {
    if(string.length <= limit) {
      return(true);
    }
    else {
      alert("Your input is too long ("+ limit +" characters allowed), please try again.")
      return(false);
    }
  }
  
  function getInputFromUser(promptMessage, defaultValue) {
    inputFromUser = prompt(promptMessage, defaultValue);
    if(inputFromUser == null) {
      inputFromUser = defaultValue;
    }
    return(inputFromUser);
  }
  
  async function uploadToServer() {
    console.log("[*] In uploadToServer()");
  
    if(isConsentGiven() == true) {
      let treeInXML = await downloadADT("");
      if((treeInXML.length <= 65408) ==  true) {
        treeName = getInputFromUser("Please name your tree", "TreeName");
        while(isInputlengthWithinLimit(64, treeName) == false) {
          treeName = getInputFromUser("Please name your tree", "TreeName");
        }
  
        userName = getInputFromUser("Please provide your name", "UserName");
        while(isInputlengthWithinLimit(32, userName) == false) {
          userName = getInputFromUser("Please provide your name", "UserName");
        }
  
        //Generate the token of the tree; between 1 (inclusive) and 99999 (inclusive)
        treeToken = Math.floor(Math.random() * 100000) + 1;
  
        let treeData = {
          userName: userName,
          treeName: treeName,
          treeToken: treeToken,
          treeInXML: treeInXML
        };
  
        try {
          let response = await fetch("https://liacs.leidenuniv.nl/~cslocs/adt.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          },
          body: JSON.stringify(treeData)
          });
  
          if(response.ok) {
            let result = await response.text();
            if(result.startsWith("ERROR") ==  false) {
              alert("Your tree identifier consists of: \n TreeName: " + treeName + "\n Token: " + treeToken
               + "\n \nPlease remember this as you will need it to retrieve your tree later.");
            }
            else alert(result);
          }
          else {
            alert("Request to the server not succesfull!" + response.status);
            console.log(response.status);
          }
  
        } catch(err) {
          alert(err);
        }
      }
      else alert("Your tree is too large to be uploaded to the server (limit is roughly 600 nodes).")
    }
  }
  
  function isFirstLineXML_Declaration(text) {
    console.log("[*] In isFirstLineXML_Declaration()");
    var xmlDeclaration = text.substring(0,5);
    if(xmlDeclaration == "<?xml") {
      return(true);
    }
    else return(false);
  }
  
  async function drawTreeFromXML(treeInXML) {
    console.log("[*] In drawTreeFromXML()");
    try {
      var input = await getJson(0, treeInXML);
      buildFromMultiset(input);
      root.initialColor();
      draw();
      toDraw = true;
      // Needed to be able to select nodes after uploading the file:
      windowResized();
      resetScaleCoordinates(root, 1);
    } catch(error) {
        console.error("Error:", error);
    }
  }
  
  async function retrieveFromServer() {
    console.log("[*] In retrieveFromServer()");
  
    treeName = getInputFromUser("Please provide your tree name", "");
    treeToken = getInputFromUser("Please provide the token for your tree", "");
  
    try {
      let response = await fetch("https://liacs.leidenuniv.nl/~cslocs/adt.php?treeName=" + treeName + "&treeToken=" + treeToken);
      if(response.ok) {
        let result = await response.text();
        console.log(result);
        if(result.startsWith("ERROR") ==  false) {
          if(isFirstLineXML_Declaration(result) == true){
            drawTreeFromXML(result)
          }
          else alert("Format not supported; xml expected.");
        }
        else {
          if(result.startsWith("ERROR: Fetch")) {
            alert("Tree not found; please check tree name and token.");
          }
          else alert(result);
        }
      }
      else {
        alert("Request to the server not succesfull!" + response.status);
        console.log(response.status);
      }
    } catch(err) {
      alert(err);
    }
  }


//   This part is the old saveScreenshot, which we'll use until a new and better screenshot tool is implement. html2canvas is terrible and doesn't work on mac.

function saveScreenshotOLD() {
    // resizeCanvas(canvas.width *2, canvas.height * 2);
    // drawLines(root);
    // saveCanvas();
    // windowResized();
    minX = 0;
    minY = 0;
    maxX = 0;
    maxY = 0;
    screenshotWalk(root);
    console.log(minX, minY, maxX, maxY);
    let newCanvWidth = Math.abs(minX - maxX);
    let newCanvHeight = Math.abs(minY - maxY);
    console.log(newCanvWidth, newCanvHeight);
    resizeCanvas(newCanvWidth, newCanvHeight);
    let XdistanceToCenter = canvasElement.position().x + newCanvWidth / 2 - (root.root.position().x + (standardWidth / 2));
    let YdistanceToCenter = canvasElement.position().y - (root.root.position().y);
    console.log(XdistanceToCenter, YdistanceToCenter);
    moveNodes(root, XdistanceToCenter, YdistanceToCenter);
    clear();
    background('white');
    drawLines(root);
    screenshotDraw(root);
    saveCanvas();
    clear();
    moveNodes(root, -XdistanceToCenter, -YdistanceToCenter);
    windowResized();
}

function screenshotDraw(node) {
    let radius = 0;
    let boxColor = "#3B8D5F";
    if (!node.isDefense) {
        radius = 20;
        boxColor = "#E28888";
    }
    strokeWeight(2);
    stroke(boxColor);
    rect(node.root.x, node.root.y, node.root.elt.offsetWidth, node.root.elt.offsetHeight, radius);
    strokeWeight(0.5);
    stroke('#B7B7B7');
    textStyle(NORMAL);
    textAlign(CENTER, CENTER)
    textSize(standardFontSize * 16 * scalar);
    // textSize(node.root.elt.offsetHeight*0.6);
    screenshotText(node);
    // text(nodeText, node.root.x + node.root.elt.offsetWidth / 2, node.root.y + node.root.elt.offsetHeight / 2);
    for (const child of node.children) {
        screenshotDraw(child);
    }

}

function screenshotText(node) {
    let nodeText = node.root.elt.innerHTML;
    nodeText = nodeText.replace(/<br>/g, "");
    // console.log(node.root.elt)
    let sep = parseInt(standardWidth / 10) + 12;
    if (nodeText.length < sep) {
        text(nodeText, node.root.x + node.root.elt.offsetWidth / 2, node.root.y + node.root.elt.offsetHeight / 2);
    } else {
        for (let i = 0; i < nodeText.length; i += sep) {
            text(nodeText.substr(i, sep), node.root.x + node.root.elt.offsetWidth / 2, node.root.y + node.root.elt.offsetHeight / 2 + i / 1.6 - 12);
        }
    }
}

function screenshotWalk(node) {
    if (node.root.position().x - (standardWidth / 2) < minX)
        minX = node.root.position().x - (standardWidth / 2);
    if (node.root.position().y < minY)
        minY = node.root.position().y;
    if (node.root.position().x + (standardWidth / 2) > maxX)
        maxX = node.root.position().x + (standardWidth / 2);
    if (node.root.position().y > maxY)
        maxY = node.root.position().y;
    for (const child of node.children) {
        screenshotWalk(child);
    }
}