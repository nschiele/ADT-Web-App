let root;
let disRoot; // Added by J
let scaled = 1;
let toDraw;
let sideFrameWidth;


let activeNode;
let activeDis;
let hoverNode;
let trackNode;
let trackNodeX;
let trackNodeY;
let trackMouseStart;
let startMouseX;
let startMouseY;

let sidePanel;
let createADTDiv;
let activeNodeTitle;

var example;
let canvasElement;
let canvasWidth;
let canvasHeight;
let canvasParentDiv;
let scaleValue;
let nodeTextChangeField;
let nodeOutLineColor;
let shapeColor = "black";
let shapeRadious = 1;
let fileName;
var currNodeText;
var newNodeText;
let oldNodetext;

// Added by C
let widthPixels;
let heightPixels;
let originalCanvWidth;
let originalCanvHeight;

// Added by J
let saveOn = false;
let biggestHeight;
let biggestWidth;
let orgScaleVal;

var IDnumber = 1; // Added by J

async function setup() {
    console.log("[*] In setup()");
    // noLoop();
    toDraw = true;
    trackMouseStart = true;
    frameRate(60);

    sideFrameWidth = 400;
    var frameX = windowWidth - sideFrameWidth;
    // var canv = createCanvas(700, 700);
    // canv.elt.style.border = "2px solid lightgray";
    // canv.parent("canvasContainer");

    // get element by id
    var canvasParentDiv = document.getElementById('canvasContainer');
    // set height and width for the canvas
    canvasWidth, biggestWidth = canvasParentDiv.offsetWidth;
    canvasHeight, biggestHeight = canvasParentDiv.offsetHeight;

    console.log("*** SETUP ***\n CANVASWIDTH = " + canvasWidth +"\nCANVASHEIGHT = " + canvasHeight + "\n"
    + "widthPixels = " + widthPixels + "\n" + "heightPixels = " + heightPixels);

    // the main canvas area where the tree will go
    canvasElement = createCanvas(canvasWidth,canvasHeight);

    // canvasElement.backgroundColor = "blue";
    
    // set parent div
    canvasElement.parent("canvasContainer");

    /* styling canvas */
    canvasElement.elt.style.border = "2px solid lightgray";

    // zoom in and out buttons
    var zoomInButton = select('#zoomInBtn');
    zoomInButton.mousePressed(zoomInFunction);
    var zoomOutButton = select('#zoomOutBtn');
    zoomOutButton.mousePressed(zoomOutFunction);
    scaleValue = 1;
    var clearTreeButton = select("#deleteBtn");
    clearTreeButton.mousePressed(clearCurrentTree);

    // // instet new json text to generate new tree
    // var jsonTextInput = select("#textAreaJsonContent").value();
    // var gererateTreeButton = select("#generateTreeButton");
    // gererateTreeButton.mousePressed(function(){buildFromMultiset(jsonTextInput.replace(/['"]+/g, ''))});

    // show selected node text in the textbox
    currNodeText = select('#nodeTextInput');
    var changeNodeTextBtn = select("#btnChangeNodeText");
    changeNodeTextBtn.mousePressed(btnChangeNodeText);

    // change outline color and shape of the selected node
    var nodeBlackCircle = select('#btnCircleBlackDiv');
    nodeBlackCircle.mouseReleased(function(){ changeNodeOutlineColorShape(50,"black")});
    var nodeGreenCircle = select('#btnCircleGreenDiv');
    nodeGreenCircle.mouseReleased(function(){changeNodeOutlineColorShape(50,"green")});
    var nodeRedCircle = select('#btnCircleRedDiv');
    nodeRedCircle.mouseReleased(function(){changeNodeOutlineColorShape(50,"red")});
    var nodeSquareBlack = select('#btnSquareBlackDiv');
    nodeSquareBlack.mouseReleased(function(){changeNodeOutlineColorShape(1,"black")});
    var nodeSquareGreen = select('#btnSquareGreenDiv');
    nodeSquareGreen.mouseReleased(function(){changeNodeOutlineColorShape(1,"green")});
    var nodeSquareRed = select('#btnSquareRedDiv');
    nodeSquareRed.mouseReleased(function(){changeNodeOutlineColorShape(1,"red")});

    var ANDoperator = select('#btnAndDiv');
    ANDoperator.mouseReleased(changeRefinementToAND);

    var ORoperator = select('#btnOrDiv');
    ORoperator.mouseReleased(changeRefinementToOR);


    // windowResized(); // Resizes window so it correctly displays all of tree.
    // draw();

    // save canvas
    // var saveBtnPng = select('#pngBtn');
    // var saveBtnJpg = select('#jpgBtn');
    var downloadBtn = select("#downloadBtn")
    // saveBtnPng.mousePressed(downloadCanvasPng);
    // saveBtnJpg.mousePressed(downloadCanvasJpg);
    downloadBtn.mousePressed(downloadCanvasJpg);

    // print
    var printBtn = select('#printBtn');
    printBtn.mousePressed(printCanvas);
    let url = "https://raw.githubusercontent.com/nschiele/ADT-Web-App/main/xml%20examples/fig13.xml";
    let resp = await fetch(url);
    var example = await getJson(0, resp); // Call json_junc.js
    console.log("WAT: ", example);
    buildFromMultiset(example);
    root.initialColor();
    document.getElementById("nodeTextInput").disabled = true; // Disable text customization until node is selected.
    ///console.log(getJson(1, example));

    console.log("ROOT.DIS.WIDTH = " + root.dis.width);

    // CHANGING THE WIDTH OF THE CANVAS, FOR CORRECT TREE RENDERING. STILL NEED TO MAKE THE CODE "NOT UGLY"
    canvasWidth = root.dis.width + 150; // 150 is > 0.5 * x_range for maximum child node width, so right buffer
    originalCanvWidth = canvasWidth;
    widthPixels = 0.001 * canvasWidth;

    // For some reason the first child has + 500?
    resetYValues(root);

    console.log("CHAIN SWAP: ");
    console.log(checkTreeHeight(root, 0));

    canvasHeight = checkTreeHeight(root, 0) + 150;
    originalCanvHeight = canvasHeight;
    heightPixels = 0.001 * canvasHeight;

    resizeCanvas(canvasWidth, canvasHeight);



    //scaled = frameX/(root.dis.width*1.2);
    console.log("SCALED: " + scaled);
}

/* For now, we maintain a scaling percentage of 25%.
This may be up to changes. */

function zoomInFunction(){
    console.log("[*] In zoomInFunction()");
    ////root.dis.x *= 1.25;
    ////root.dis.x_range *= 1.25;
    ////root.dis.y *= 1.25;
    ////root.dis.y_range *= 1.25;

    scaleValue *= 1.25;

    changeCoordinates(1.25);


/*
    var myElement = document.getElementById("defaultCanvas0");
    var scaleIt = 1.25;
    var centerX = 100;
    var centerY = 100;
    scaleAround(myElement, scaleValue, centerX, centerY);
*/

    ////root.dis.adjust_textbox();
}

function zoomOutFunction(){
    console.log("[*] In zoomOutFunction()");

    scaleValue *= 0.8;

    changeCoordinates(0.8);

/*
    var myElement = document.getElementById("defaultCanvas0");
    var scaleIt = 0.8;
    var centerX = 100;
    var centerY = 100;
    scaleAround(myElement, scaleValue, centerX, centerY);
*/
    ////root.dis.adjust_textbox();

}

function btnChangeNodeText(){
    console.log("[*] In btnChangeNodeText()");
    var newNodeText = select("#nodeTextInput").value();
    // to be continued
}

function changeNodeOutlineColorShape(shapeRadious,shapeColor){
    console.log("[*] In changeNodeOutlineColorShape()");
    if (notificationCheckNode('noti-shacol', 'noti-body-shacol')) {
        return;
    }
    var attack;
    var isBlack = false;
    var parentCheck = false;
    var turnToBlack = false;
    var otherType = false;
    if (activeNode.type === 0 && shapeColor === "green") {
      attack = true;
    } else if (activeNode.type === 1 && shapeColor === "red") {
      attack = false;
    } else if (shapeColor == "black") {
      turnToBlack = true;
    } else {
      isBlack = true;
      otherType = true;
    }
    if (!isBlack) {
      // check child nodes function
      var returnCode = activeNode.checkParentChild(attack, parentCheck);
      if (returnCode < 0) {
        if ((attack && shapeColor == "green") || (!attack && shapeColor == "red"))  {
          notificationParentChildCheckFailure('noti-shacol', 'noti-body-shacol', attack, returnCode);
          return;
        } else {
          otherType = true;
        }
      }
    }
    if (!otherType && activeNode.parent != null) {
      if (attack) {
        activeNode.parent.attackNodeHasDefenseNode = true;
      } else if (!attack) {
        activeNode.parent.defenseNodeHasAttackNode = true;
      }
    }
    console.log(isBlack, shapeColor, activeNode.type);
    if ((isBlack && ((shapeColor == "red" && activeNode.type == 0) || (shapeColor == "green" && activeNode.type == 1))) || !isBlack || turnToBlack ) {
      nodeOutLineColor = true;
      activeNode.dis.stroke = color(shapeColor);
      activeNode.dis.strokeWeight = 3;
      activeNode.dis.r = shapeRadious;
      notificationSuccess('noti-shacol', 'noti-body-shacol', "Node changed successfully!"); // Send success notification if node has been added.
    }
}

function changeNodeLineToContinueLine(){
    console.log("[*] In changeNodeLineToContinueLine()");
    if (notificationCheckNode('noti-shacol', 'noti-body-shacol')) {
        return;
    }

    activeNode.dis.lineList = [0];
    notificationSuccess('noti-shacol', 'noti-body-shacol', "Connector changed successfully!"); // Send success notification if node has been added.
}

function changeNodeLineToDashed() {
    console.log("[*] In changeNodeLineToDashed()");
    if (notificationCheckNode('noti-shacol', 'noti-body-shacol')) {
        return;
    }

    activeNode.dis.lineList = [10,10,10,10];
    notificationSuccess('noti-shacol', 'noti-body-shacol', "Connector changed successfully!"); // Send success notification if node has been added.
}

function changeRefinementToAND() {
    console.log("[*] In changeRefinementToAND()");
    if (notificationCheckNode('noti-shacol', 'noti-body-shacol')) {
        return;
    }
    activeNode.refinement = 1;
    notificationSuccess('noti-shacol', 'noti-body-shacol', "Operator changed successfully!"); // Send success notification if node has been added.
}

function changeRefinementToOR() {
    console.log("[*] In changeRefinementToOR()");
    if (notificationCheckNode('noti-shacol', 'noti-body-shacol')) {
        return;
    }
    activeNode.refinement = 0;
    notificationSuccess('noti-shacol', 'noti-body-shacol', "Operator changed successfully!"); // Send success notification if node has been added.
}

function downloadCanvasPng(){
    console.log("[*] In downloadCanvasPng()");
    fileName = select("#treeName").value();
    ///console.log(fileName);
    saveCanvas(canvasElement, fileName, 'png');
}

function downloadCanvasJpg(){
    console.log("[*] In downloadCanvasJpg()");
    fileName = select("#treeName").value();
    saveOn = true; // Save mode on, needed for draw()
    orgScaleVal = scaleValue; // Save previous scale value
    scaleValue = 1; // Set scale value to 1, original canvas size
    console.log(root);
    draw(); // Call draw()
}

function notificationCheckNode(notiEl, bodyEl) {
    const noti = document.getElementById(notiEl);
    console.log(document.getElementById('noti-add'));
    console.log("NOTI: ", noti);
    const body = document.getElementById(bodyEl);
    console.log("BODY: ", activeNode);
    if (activeNode == undefined) {
        // No node selected. Notification prep.
        body.style.color = "red";
        body.style.backgroundColor = "lightcoral";
        noti.querySelector("." + bodyEl).innerHTML = "Error! No node selected.";
        noti.classList.add('visible');
        setTimeout (() => {
            noti.classList.remove('visible');
        }, 2000); // Remove notification after 2 seconds.
        return true;
    }
}

function notificationTextLength(notiEl, bodyEl, textInput) {
    console.log("TEXTLENGTH", textInput.length);
    const noti = document.getElementById(notiEl);
    console.log(document.getElementById('noti-add'));
    console.log("NOTI: ", noti);
    const body = document.getElementById(bodyEl);
    console.log("BODY: ", activeNode);
    if (textInput.length == 0 || textInput.length > 128) {
        // No node selected. Notification prep.
        body.style.color = "red";
        body.style.backgroundColor = "lightcoral";
        noti.querySelector("." + bodyEl).innerHTML = "Error! Label length must be between 1 and 128 characters.";
        noti.classList.add('visible');
        setTimeout (() => {
            noti.classList.remove('visible');
        }, 2000); // Remove notification after 2 seconds.
        return true;
    }
}

function notificationAlreadyDefenseNode(newNode, notiEl, bodyEl, defense) {
    const noti = document.getElementById(notiEl);
    const body = document.getElementById(bodyEl);
    console.log("ik ga huilie: ", defense);
    if (newNode.parent.attackNodeHasDefenseNode && defense) {
        body.style.color = "red";
        body.style.backgroundColor = "lightcoral";
        noti.querySelector("." + bodyEl).innerHTML = "Error! Current node already has a defense node!";
        noti.classList.add('visible');
        setTimeout (() => {
            noti.classList.remove('visible');
        }, 2000); // Remove notification after 2 seconds.
        return true;
    }
    else if (newNode.parent.defenseNodeHasAttackNode && !defense) {
        body.style.color = "red";
        body.style.backgroundColor = "lightcoral";
        noti.querySelector("." + bodyEl).innerHTML = "Error! Current node already has an attack node!";
        noti.classList.add('visible');
        setTimeout (() => {
            noti.classList.remove('visible');
        }, 2000); // Remove notification after 2 seconds.
        return true;
    }
}

function notificationSuccess(notiEl, bodyEl, notificationContents) {
    const noti = document.getElementById(notiEl);
    const body = document.getElementById(bodyEl);
     // Succesful! Notification prep.
     body.style.color = "green";
     body.style.backgroundColor = "lightgreen";
     noti.querySelector("." + bodyEl).innerHTML = notificationContents;

     noti.classList.add('visible');
     setTimeout (() => {
         noti.classList.remove('visible');
     }, 2000); // Remove notification after 2 seconds.
}

function notificationIsRootNode(notiEl, bodyEl, activeN) {
  const noti = document.getElementById(notiEl);
  const body = document.getElementById(bodyEl);
  if (activeN === root) {
      body.style.color = "red";
      body.style.backgroundColor = "lightcoral";
      noti.querySelector("." + bodyEl).innerHTML = "Error! Selected node is root node.";
      noti.classList.add('visible');
      setTimeout (() => {
          noti.classList.remove('visible');
      }, 2000); // Remove notification after 2 seconds.
      return true;
  }
}

function notificationParentChildCheckFailure(notiEl, bodyEl, attack, returnCode) {
  const noti = document.getElementById(notiEl);
  const body = document.getElementById(bodyEl);
  body.style.color = "red";
  body.style.backgroundColor = "lightcoral";
  if (attack) {
    if (returnCode === -1) {
      noti.querySelector("." + bodyEl).innerHTML = "Error! Parent is invalid if this node is changed to defense node.";
    } else if (returnCode === -2) {
      noti.querySelector("." + bodyEl).innerHTML = "Error! This node is invalid if it is changed to a defense node.";
    }
  } else if (!attack) {
    if (returnCode === -1) {
      noti.querySelector("." + bodyEl).innerHTML = "Error! Parent is invalid if this node is changed to attack node.";
    } else if (returnCode === -2) {
      noti.querySelector("." + bodyEl).innerHTML = "Error! This node is invalid if it is changed to an attack node.";
    }
  }
  noti.classList.add('visible');
  setTimeout (() => {
      noti.classList.remove('visible');
  }, 2000); // Remove notification after 2 seconds.
  return true;
}

function manAddChild(){
    console.log("[*] In manAddChild()");
    var input = document.getElementById("nodeChildTextInput").value;
    if (notificationCheckNode('noti-add', 'noti-body-add')) {
        // Send error notification if activeNode is undefined.
        return;
    }
    if (notificationTextLength('noti-add', 'noti-body-add', input)) {
        // Send error notification if activeNode is undefined.
        return;
    }

    // Add new tree objects in variables
    var childTree = new ADTree(input, IDnumber);
    var childDisplay = new Display(input, 0, 0, 2);

    // Attach new tree objects as new node under actively selected child.
    activeNode.add_child(childTree, childDisplay);

    // We check if some elements are now "out of the canvas". Then we resize.

    var newWidth = checkTreeWidth(root);

    console.log("NEWWIDTH: " + newWidth);
    console.log("NEWHEIGHT: " + newHeight);
    // Retrieve newly added child, change look to attack node.
    var newNode = childTree.dis.tree;
    newNode.dis.stroke = color('red');
    newNode.dis.strokeWeight = 3;
    newNode.dis.r = 50;
    // childTree.children.at(-1).dis.lineList = [10, 10, 10, 10];
    var defense;

    if (document.getElementById("flexSwitchCheckDefault").checked == 1) {
        console.log("is defense");
        defense = false;
        // Check if defense check has been checked.
        // Change look to defense child.

        // If parent is attack node, only one defense node
        if (newNode.parent.type == 0) {
          defense = true;
        }
        if (notificationAlreadyDefenseNode(newNode, 'noti-add', 'noti-body-add', defense) && defense) {
            root.removeSubTree(newNode);
            activeNode.dis._textbox();
            activeNode.update_width();
            windowResized();
            resetScaleCoordinates(root, 1);
            changeCoordinatesRec(scaleValue, root);
            return;
        }
        newNode.dis.stroke = color('green');
        newNode.dis.strokeWeight = 3;
        newNode.dis.r = 1;
        // If parent is defense node and hasn't had attack node yet, set it now that it does have a defense node
        if (newNode.parent.type == 0)
          newNode.parent.attackNodeHasDefenseNode = true;
        // activeNode.children.at(-1).dis.lineList = [10,10,10,10];
    } else if (document.getElementById("flexSwitchCheckDefault").checked == 0) {
      defense = true;

      // If parent is defense node, only one attack node
      if (newNode.parent.type == 1) {
        defense = false;
      }
      if (notificationAlreadyDefenseNode(newNode, 'noti-add', 'noti-body-add', defense) && !defense) {
        root.removeSubTree(newNode);
        activeNode.dis.adjust_textbox();
        activeNode.update_width();
        windowResized();
        resetScaleCoordinates(root, 1);
        changeCoordinatesRec(scaleValue, root);
        return;
      }
      // newNode.dis.stroke = color('green');
      // newNode.dis.strokeWeight = 3;
      // newNode.dis.r = 1;
      
      // If parent is defense node and hasn't had attack node yet, set it now that it does have an attack node
      if (newNode.parent.type === 1) { 
        newNode.parent.defenseNodeHasAttackNode = true;
      }
    }
    activeNode.dis.adjust_textbox();
    activeNode.update_width();
    windowResized();
    resetScaleCoordinates(root, 1);
    console.log("Scalevalue now: " + scaleValue);
    changeCoordinatesRec(scaleValue, root);
    printCoordinates(root);


    IDnumber++;
    document.getElementById("nodeTextInput").setAttribute("placeholder", activeNode.dis.t);
    notificationSuccess('noti-add', 'noti-body-add', "Child added successfully!"); // Send success notification if node has been added.

    var newHeight = checkTreeHeight(root, 1);
    console.log("new height: " + newHeight);

    if (newHeight > canvasHeight){
      canvasHeight = newHeight + 20;
      resizeCanvas(canvasWidth, canvasHeight);
    }
    draw();
}

function manDeleteChild(){
    console.log("[*] In manDeleteChild()");
    // var parent = activeNode.parent; // Added by C
    if (notificationCheckNode('noti-rem', 'noti-body-rem')) {
        // Send error notification if activeNode is undefined.
        return;
    }
    if (notificationIsRootNode('noti-rem', 'noti-body-rem', activeNode)) {
        // Send error notification if activeNode is root.
        return;
    }

    root.removeSubTree(activeNode); // Function removeSubtree gives error.

    if (activeNode.parent.type == 0 && activeNode.type == 1) {
      activeNode.parent.attackNodeHasDefenseNode = false;
    } else if (activeNode.parent.type == 1 && activeNode.type == 0) {
      activeNode.parent.defenseNodeHasAttackNode = false;
    }
    
    activeNode.parent.dis.update_width(activeNode.parent);
    activeNode.parent.dis.adjust_children(root);
    activeNode = undefined;
    windowResized();
    //draw();
    resetScaleCoordinates(root, 1);
    // root.dis.adjust_textbox();
    // root.adjust_width();
    console.log("Scalevalue now: " + scaleValue);
    changeCoordinatesRec(scaleValue, root);
    document.getElementById("nodeTextInput").disabled = true;
    document.getElementById("nodeTextInput").value = "";
    document.getElementById("nodeTextInput").setAttribute("placeholder", "No node selected...");
    draw();
    notificationSuccess('noti-rem', 'noti-body-rem', "Node deleted successfully!"); // Send success notification if node has been deleted.
}

function manChangeChild(){
    console.log("[*] In manChangeChild()");
    var input = document.getElementById("nodeTextInput").value;
    if (notificationCheckNode('noti-cha', 'noti-body-cha')) {
        // Send error notification if activeNode is undefined.
        return;
    }
    if (notificationTextLength('noti-cha', 'noti-body-cha', input)) {
        // Send error notification if activeNode is undefined.
        return;
    }
    activeNode.label = input;
    activeNode.dis.t = input;
    document.getElementById("nodeTextInput").setAttribute("value", "");
    // activeNode.dis.adjust_textbox();
    // root.dis.adjust_children(activeNode);
    // activeNode.dis.update_width(activeNode);
    // resetScaleCoordinates(root, true);
    // changeCoordinatesRec(scaleValue, root);
    activeNode.dis.adjust_textbox();
    activeNode.update_width();
    windowResized();
    resetScaleCoordinates(root, 1);
    console.log("Scalevalue now: " + scaleValue);
    changeCoordinatesRec(scaleValue, root);
    printCoordinates(root);
    draw();
    notificationSuccess('noti-cha', 'noti-body-cha', "Node changed successfully!"); // Send success notification if node has been changed.
}

// Download & Upload

async function downloadADT(selectedFormat) {
    console.log("[*] In downloadADT()");
    return new Promise(function(resolve) {
        root.convertADTtoNode(null);
        // root.setNodeStruc(null);

        var parser = new DOMParser();
        var temp_string = '<?xml version="1.0"?>'
        temp_string += '\n';
        temp_string += '<adtree>';
        var xml = null;
        temp_string = root.addChildInXML(temp_string);
        temp_string += '\n';
        temp_string += '</adtree>';
        console.log("DAAR GAAN WE: ", temp_string);
        xml = parser.parseFromString(temp_string, "text/xml");
        console.log("Final: ", xml);
        resolve(temp_string);

        // if (selectedFormat === "xml") {
        //     var blob = new Blob([temp_string], { type: "text/plain;charset=utf-8"});
        //     var downloadLink = document.createElement("a");
        //     downloadLink.href = URL.createObjectURL(blob);
        //     downloadLink.download = "SavedADT.xml";
        //     downloadLink.click();
        // } else if (selectedFormat === "json") {
        //     jsonfile = await getJson(0, temp_string);

        // }
    });
    // jsonObject = new Node();
    // jsonObject.label = root.label;
    // jsonObject.refinement = root.refinement;
    // jsonObject.depth = root.level;
    // jsonObject.parent = null;

}

async function downloadPrep() {
    // var selectedFormat = document.getElementById("formatDropdown").value;
    var selectedFormat = "xml";
    try {
      var file = await downloadADT(selectedFormat);
      console.log("yayayayay: ", file);
      var input;
      input = file;
      var blob = new Blob([input], { type: "text/plain"});
      var downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "SavedADT." + selectedFormat;
      if (!(root.checkForWarnings()))
        alert("Caution! You are trying to download your tree in .xml with black nodes present. This could lead to unstable behaviour when uploading into ADTapp.")
      downloadLink.click();
    } catch(error) {
        console.error("Error:", error);
    }
}

function uploadADT() {
    console.log("[*] In uploadADT()");
    return new Promise(function(resolve, reject) {
      var ADTInput = document.getElementById('ADTInput');
      console.log(ADTInput);
      ADTInput.click();
      ADTInput.addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (file) {
          var fileName = file.name;
          var fileExt = fileName.split('.').pop();

          if (fileExt === 'xml') {
              console.log("XML");
              resolve(file);
          } else {
              console.log("Unsupported");
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
            console.log("YA: ", file);
        } 
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


function printCanvas(){
    console.log("[*] In printCanvas()");

    let printWindow = window.open('', '_blank');
    printWindow.location.reload();
    printWindow.document.open();
    printWindow.document.write('<html><head><title>Print ADT</title>');
    printWindow.document.write('<style>@media print { #printContent { display: block;} #printElement{width:210mm; height:auto}}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<img id="printElement"src="' + canvasElement.elt.toDataURL() + '">');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(function() {
        printWindow.print();
    }, 500);
}

function clearCurrentTree(){
    console.log("[*] In clearCurrentTree()");

    example = [[],0,[]];
    // console.log("start");
    buildFromMultiset(example);
}

function max_depth(n){
    console.log("[*] In max_depth()");

    if(n.children.length == 0){
        return n.dis.level;
    } else {
        var toReturn = n.dis.level;
        for(let i = 0; i < n.children.length; i++){
            var child_level = max_depth(n.children[i]);
            if(child_level > toReturn){
                toReturn = child_level;
            }
        }
        return toReturn;
    }
}

function max_width(n, dist){
    console.log("[*] In max_width()");
    var toReturn = n.dis.x_range;
    var curr_level = 0;
    var curr_width = -1*dist;
    var searchOrder = [];

    searchOrder.push(n);
    for(let i = 0; i < searchOrder.length; i++){
        for(let j = 0; j < searchOrder[i].children.length; j++){
            searchOrder.push(searchOrder[i].children[j]);
        }
      // console.log(searchOrder[i], searchOrder)
      if(searchOrder[i].dis.level == curr_level){ //Still on same level
            curr_width += searchOrder[i].dis.x_range;
            curr_width += dist;
        // console.log("Same Level: ", searchOrder[i].level, curr_level, toReturn)
      } else { //Now searching the next level
        // console.log("New Level: ", searchOrder[i].level, curr_level, toReturn)
        if(toReturn < curr_width){
            toReturn = curr_width;
        }
        curr_width = searchOrder[i].dis.x_range;
        curr_level = searchOrder[i].dis.level;

      }
      // console.log(searchOrder[i], searchOrder[i].x_range, curr_width, curr_level, toReturn)
    }
    if(toReturn < curr_width){
        toReturn = curr_width;
    }
    return toReturn;
  }

async function buildFromMultiset(toBuild, parent=null){
    console.log("[*] In buildFromMultiset()");
    console.log("JSON");
    console.log(toBuild);
    console.log(toBuild[0]);


    ///console.log(root)

    // First Run of Function
    if(parent == null){
        ///console.log("hier: ", toBuild);

        root = new ADTree(toBuild[0].label, IDnumber); // Get label of root
        IDnumber++;

        ///disRoot = new Display(toBuild[0].label/*adtree.node.label*/, 0, 0, 2); // Added by J

        root.refinement = toBuild[0].refinement;
        root.type = toBuild[0].swith_role;

        root.dis.y = 20;
        ///console.log("Root: ", root); // Added by J

        console.log("Keys: " + Object.keys(toBuild[0])); // Added by C

        // Make defense node the last node in the JSON.
        toBuild[0] = reorderChilds(toBuild[0]);

        for(let i = 0; i < Object.keys(toBuild[0]).length-6; i++){ // Loop through all children
            buildFromMultiset(toBuild[0][i], root);
        }

    // Tree Exists, adding subtrees
    } else {

      if(!(toBuild === null || toBuild === undefined) && Object.keys(toBuild).length-7 != 0){ // This was 6, with 7 it works, because 7 array elements for normal intermediate node

            var child = new ADTree(toBuild.label, IDnumber); // Get label of current node
            child.refinement = toBuild.refinement;
            child.type = toBuild.swith_role;

            // Check if attack- and defense nodes only have 1 defense node and attack node resp.
            if (parent.type == 0 && child.type == 1) {
              if (parent.attackNodeHasDefenseNode){
                console.log("Already has defense node!");
                return;
              } else {
                parent.attackNodeHasDefenseNode = true;
              }
            } else if (parent.type == 1 && child.type == 0) {
              if (parent.defenseNodeHasAttackNode){
                console.log("Already has attack node!");
                return;
              } else {
                parent.defenseNodeHasAttackNode = true;
              }
            }

            parent.add_child(child, new Display(toBuild.label, 0, 0, 2));
            IDnumber++;

            // Make defense node the last node in the JSON.
            toBuild = reorderChilds(toBuild);

            for (let i = 0; i < (Object.keys(toBuild).length-7); i++){ // Loop through all children
                buildFromMultiset(toBuild[i], child);
            }

      //Leaf Node
      } else if (!(toBuild == null || toBuild == undefined)){
            var child = new ADTree(toBuild.label, IDnumber); // Get label of child
            child.type = toBuild.swith_role;

            // Check if attack- and defense nodes only have 1 defense node and attack node resp.
            if (parent.type == 0 && child.type == 1) {
              if (parent.attackNodeHasDefenseNode){
                console.log("Already has defense node!");
                return;
              } else {
                parent.attackNodeHasDefenseNode = true;
              }
            } else if (parent.type == 1 && child.type == 0) {
              if (parent.defenseNodeHasAttackNode){
                console.log("Already has attack node!");
                return;
              } else {
                parent.defenseNodeHasAttackNode = true;
              }
            }
            
            parent.add_child(child, new Display(toBuild.label, 0, 0, 2));
            // console.log("a leafje", toBuild.label);
            IDnumber++;
        }
    }
}

function draw(){
    console.log("[*] In draw()");
    // If ADT is larger than the canvas, shrink ADT and place in center
    if(toDraw){
        if (!(root == undefined || root.dis == undefined)){
          console.log("root.dis.width: " + root.dis.width);
          if ((root.dis.width + 150) > canvasWidth){
            canvasWidth = root.dis.width + 150;
            resizeCanvas(canvasWidth, canvasHeight);
          }

          root.dis.x = root.dis.width/2;
          root.adjust_children();
        }

        // zoom in/out
        //console.log("scaleValue: ", scaleValue); // added by C
        scale(scaleValue);

        clear();

        if (root != null && root != undefined){
          if (saveOn) {
            // Saving mode on, saving canvas.
            background("white");
            if (activeNode != null) 
              activeNode.dis.active = false; // Turn active node off for jpg
            root.display(); // Draw tree with scale = 1 and white background
            if (!(root.checkForWarnings()))
              alert("Caution! Your ADT contains black nodes, which are not seen as attack or defense nodes.")
            saveCanvas(canvasElement, fileName, 'jpg'); // Actually saving the canvas
            if (activeNode != null)
              activeNode.dis.active = true; // Turn active node back on
            saveOn = false; // Turn off the saving mode
            scaleValue = orgScaleVal; // Resizing to previous scale
            draw(); // Rerun with Saving mode off
          } else if (!saveOn) {
            background("whitesmoke");
            canvasElement.elt.style.border = "2px solid lightgray";
          }
          root.display();
          toDraw = false;
        }

    }
    //What node is the mouse currently over
    if (!(root == null || root == undefined)){
      var mouseNode = root.dis.checkCoordinates(root, mouseX, mouseY);

    }
    //If the mouse is hoving over a node
    if(mouseNode != null && mouseNode != hoverNode){
        ///console.log("HOVAH: ", mouseNode);
        hoverNode = mouseNode;
        toDraw = true;
    } else if (mouseNode == null && hoverNode != null){
        hoverNode.hover = false;
        hoverNode = null;
        toDraw = true;
    }

    //If the mouse clicks and holds on a node
    if(mouseIsPressed && (mouseNode != null || !trackMouseStart)){
        if(trackMouseStart){
            startMouseX = mouseX;
            startMouseY = mouseY;
            trackNode = mouseNode;
            trackMouseStart = false;
            trackNode.freeMove = true;
        }
      // trackNode.x = (-1* startMouseX + mouseX)/scaled;
      // trackNode.y = (-1*startMouseY + mouseY)/scaled;
        toDraw = true;
    //   console.log("Registering Mouse Press", startMouseX - mouseX, startMouseY - mouseY, trackNode.x, trackNode.y);
    }

  // Check if the canvas needs to be resized accordingly.
  checkArrowsPressed();
}

function mouseReleased(){
    console.log("[*] In mouseReleased()");
    var clickedNode = trackNode;

    console.log("Coordinates: ", mouseX, mouseY);
    //if (clickedNode != undefined)
      //console.log(clickedNode.dis.scale_x + "/" + clickedNode.dis.scale_x_range);

    if (clickedNode != null && activeNode == null) {
        clickedNode.active = true;
        activeDis = clickedNode;
        activeNode = activeDis.tree;
    }
    if (activeDis != null && clickedNode != null) {
        activeDis.active = false;
        clickedNode.active = true;
        activeDis = clickedNode;
        activeNode = activeDis.tree;
    }

    toDraw = true;
    trackMouseStart = true;
    trackNode = null;

    console.log(mouseX, canvasWidth, mouseY, canvasHeight);
    if (clickedNode == null && activeNode != null && ((mouseX > (canvasWidth - canvasWidth) && mouseX < canvasWidth) && (mouseY > (canvasHeight - canvasHeight) && mouseY < canvasHeight))) {
        console.log(mouseX, canvasWidth, canvasHeight);
        console.log("NUUUUU");
        activeDis.active = false;
        activeNode = null;
        // activeNode = null;
    }
   
    document.getElementById("nodeTextInput").setAttribute("value", "");
    if (activeNode != null) {
        document.getElementById("nodeTextInput").disabled = false;
        document.getElementById("nodeTextInput").setAttribute("value", activeNode.dis.t);
    } else {
        document.getElementById("nodeTextInput").disabled = true;
        document.getElementById("nodeTextInput").setAttribute("value", "");
        document.getElementById("nodeTextInput").setAttribute("placeholder", "No node selected...");
    }

}

function windowResized() {
    console.log("[*] In windowResized()");
    var frameX = (windowWidth - sideFrameWidth);
    console.log("frame x: ", frameX);

    ///scaled = frameX/(root.dis.width*1.2 + (root.dis.x_range)); // Fixed scaling when resizing window.
    // scaled = frameX/(root.dis.width*1/2);

    if (!(sidePanel == undefined || sidePanel == null)){
      sidePanel.position(frameX, 0);
    }

    // console.log("size: ", windowWidth, windowHeight);
    // resizeCanvas(windowWidth, windowHeight);
    resizeCanvas(canvasWidth,canvasHeight);
    toDraw = true;
}

function scaleAround(element, scaleValue, centerX, centerY){
  var transformOrigin = centerX + "px " + centerY + "px";
  element.style.transformOrigin = transformOrigin;
  element.style.transform = "scale(" + scaleValue + ")";
}

function changeActiveNavLinkColor(){
  console.log("[!] TODO: kleurdingen toevoegen.");
}

function notificationShowAlertADTLang(notiEl, bodyEl, success) {
  console.log("[!] TODO: Generate button fixen (Meza!).");
  const noti = document.getElementById(notiEl);
  console.log(document.getElementById('noti-add'));
  console.log("NOTI: ", noti);
  const body = document.getElementById(bodyEl);
  console.log("BODY: ", activeNode);
  if (success) {
    // No node selected. Notification prep.
    body.style.color = "green";
    body.style.backgroundColor = "lightgreen";
    noti.querySelector("." + bodyEl).innerHTML = "Tree has been constructed from ADTLang input!";
    noti.classList.add('visible');
    setTimeout (() => {
        noti.classList.remove('visible');
    }, 2000); // Remove notification after 2 seconds.
    return true;
  } else {
    body.style.color = "red";
    body.style.backgroundColor = "lightcoral";
    noti.querySelector("." + bodyEl).innerHTML = "Error! ADTLang input invalid.";
    noti.classList.add('visible');
    setTimeout (() => {
        noti.classList.remove('visible');
    }, 2000); // Remove notification after 2 seconds.
    return true;
  }
}

function changeCoordinatesRec(newScaleValue, currentNode){
  if (currentNode != null){
    currentNode.dis.scale_x *= newScaleValue;
    currentNode.dis.scale_x_range *= newScaleValue;
    currentNode.dis.scale_y *= newScaleValue;
    currentNode.dis.scale_y_range *= newScaleValue;

  }

//   console.log("*** CHANGECOORDINATESREC ***");
//   console.log("LABEL: " + currentNode.label);
//   console.log("SCALE_X: " + currentNode.dis.scale_x);
//   console.log("SCALE_X_RANGE: " + currentNode.dis.scale_x_range);
//   console.log("SCALE_Y: " + currentNode.dis.scale_y);
//   console.log("SCALE_Y_RANGE: " + currentNode.dis.scale_y_range);


  for (let i = 0; i < currentNode.children.length; i++){
    changeCoordinatesRec(newScaleValue, currentNode.children[i]);
  }
}

function changeCoordinates(newScaleValue){
  console.log("[*] In changeCoordinates()");
  var treeRoot = root;

  ////printCoordinates(treeRoot);

  changeCoordinatesRec(newScaleValue, treeRoot);

}

function resetScaleCoordinates(currentNode, recursion){
  // console.log("[*] In resetScaleCoordinates()");

  console.log("LABEL: " + currentNode.label);
  console.log("x/x_range: " + currentNode.dis.x + "/" + currentNode.dis.x_range);
  currentNode.dis.scale_x = currentNode.dis.x;
  currentNode.dis.scale_x_range = currentNode.dis.x_range;
  currentNode.dis.scale_y = currentNode.dis.y;
  currentNode.dis.scale_y_range = currentNode.dis.y_range;

  if (recursion){
    // console.log("[*] In resetScaleCoordinates()");
    for (let i = 0; i < currentNode.children.length; i++){
      console.log("[*] In resetScaleCoordinates()", currentNode);
      resetScaleCoordinates(currentNode.children[i], recursion);
    }
  }

}

function printCoordinates(currentNode){
//   console.log("*** Current Node: " + currentNode.label + " ***");
//   console.log("Coordinates:\nx/x_range: " + currentNode.dis.x + "/" + currentNode.dis.x_range);
//   console.log("y/y_range: " + currentNode.dis.y + "/" + currentNode.dis.y_range);
//   console.log("scale_x/scale_x_range: " + currentNode.dis.scale_x + "/" + currentNode.dis.scale_x_range);
//   console.log("scale_y/scale_y_range: " + currentNode.dis.scale_y + "/" + currentNode.dis.scale_y_range);
//   console.log("width: " + currentNode.dis.width + "\n\n");

  for (let i = 0; i < currentNode.children.length; i++)
    printCoordinates(currentNode.children[i]);
}

// LEFT_ARROW = 37, UP_ARROW = 38, RIGHT_ARROW = 39, DOWN_ARROW = 40
function tryResizeCanvas(keyCode){

  if (keyCode == 37 && isAllowed(keyCode))
    canvasWidth -= widthPixels;

    else if (keyCode == 38 && isAllowed(keyCode))
    canvasHeight -= heightPixels;

  else if (keyCode == 39)
    canvasWidth += widthPixels;

  else if (keyCode == 40)
    canvasHeight += heightPixels;

  resizeCanvas(canvasWidth, canvasHeight);

   // Removed bug of not (instantly!) rendering tree after resizing canvas. Remove this line to verify my claim yourself.
  if (scaleValue == 1)
    root.display();

  else
    mouseReleased();
}

function keyPressed(){
  console.log(keyCode);

  // LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW
  if (keyCode >= 37 && keyCode <= 40){
    tryResizeCanvas(keyCode);
  }
}

// In development
function isAllowed(keyCode){
  console.log("originalCanvWidth: " + originalCanvWidth);
  console.log("originalCanvHeight: " + originalCanvHeight);

  // LEFT_ARROW
  if (keyCode == 37){
    if (Math.ceil(canvasWidth - widthPixels) < Math.ceil(originalCanvWidth))
      return false;
  }

  // UP_ARROW
  else if (keyCode == 38){
    if (Math.ceil(canvasHeight - heightPixels) < Math.ceil(originalCanvHeight))
      return false;
  }

  return true;
}

function checkArrowsPressed(){
  if (keyIsDown(LEFT_ARROW))
    tryResizeCanvas(LEFT_ARROW);

  else if (keyIsDown(UP_ARROW))
    tryResizeCanvas(UP_ARROW);

  else if (keyIsDown(RIGHT_ARROW))
    tryResizeCanvas(RIGHT_ARROW);

  else if (keyIsDown(DOWN_ARROW))
    tryResizeCanvas(DOWN_ARROW);
}

// In development
function reorderChilds(JSONObject){
  let changeIt = false;
  let indexChange = 0;
  let tempHold = 0;

  ////console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  ////console.log("LABEL: " + JSONObject.label);
  ////console.log("TYPE: " + JSONObject.type);

  for (let i = 0; i < (Object.keys(JSONObject).length-7); i++){
    if (JSONObject.swith_role != JSONObject[i].swith_role){
      changeIt = true;
      indexChange = i;

      // LOGGING; for development
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      console.log("LABEL: " + JSONObject.label);

      break;
    }

  }

  // Make the defense/attack child on resp. attack/defense node the final in the list

  if (changeIt){
    tempHold = JSONObject[Object.keys(JSONObject).length-8]; // Final element
    console.log(Object.keys(JSONObject).length - 7);
    console.log(JSONObject);
    console.log("TEMPHOLD.label: " + tempHold.label);

    JSONObject[Object.keys(JSONObject).length-8] = JSONObject[indexChange];
    JSONObject[indexChange] = tempHold;
  }

  return JSONObject;
}

function checkTreeWidth(currentNode){
  maximum = currentNode.dis.x + currentNode.dis.x_range;

  var temp = 0;

  for (let i = 0; i < currentNode.children.length; i++){
    temp = checkTreeWidth(currentNode.children[i]);

    if (temp > maximum)
      maximum = temp;
  }

  return maximum;
}

function checkTreeHeight(currentNode, mode){
  var maximum = 0;

  if (!mode)
    maximum = Math.ceil(currentNode.dis.y / scaleValue) + currentNode.dis.y_range;


  else if (mode)
    maximum = Math.ceil(currentNode.dis.scale_y / scaleValue) + currentNode.dis.y_range;



  var temp = 0;

  for (let i = 0; i < currentNode.children.length; i++){
    temp = checkTreeHeight(currentNode.children[i]);

    if (temp > maximum)
      maximum = temp;
  }

  return maximum;
}

function resetYValues(currentNode){
  for (let i = 0; i < currentNode.children.length; i++){
    currentNode.children[i].dis.y = currentNode.dis.y + 100;
    resetYValues(currentNode.children[i]);
  }

}
