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
    canvasWidth = canvasParentDiv.offsetWidth;
    canvasHeight = canvasParentDiv.offsetHeight;
    // the main canvas area where the tree will go
    canvasElement = createCanvas(canvasWidth,canvasHeight);
    canvasElement.background("lightgray");
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

    // change the lines to dashed
    var dashedLine = select('#btnLineDashedDiv');
    dashedLine.mouseReleased(changeNodeLineToDashed);

    var ContinuousLine = select('#btnLineContinueDiv');
    ContinuousLine.mouseReleased(changeNodeLineToContinueLine);

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
    ///console.log(getJson(1, example));

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
      nodeOutLineColor = true;
      activeNode.dis.stroke = color(shapeColor);
      activeNode.dis.strokeWeight = 3;
      activeNode.dis.r = shapeRadious;
}

function changeNodeLineToContinueLine(){
    console.log("[*] In changeNodeLineToContinueLine()");

    activeNode.dis.lineList = [0];
}

function changeNodeLineToDashed() {
    console.log("[*] In changeNodeLineToDashed()");

    activeNode.dis.lineList = [10,10,10,10];
}

function changeRefinementToAND() {
    console.log("[*] In changeRefinementToAND()");

    activeNode.refinement = 1;
}

function changeRefinementToOR() {
    console.log("[*] In changeRefinementToOR()");
    activeNode.refinement = 0;
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
    ///console.log(fileName);
    saveCanvas(canvasElement, fileName, 'jpg');
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
    activeNode.add_child(new ADTree(input, IDnumber), new Display(input, 0, 0, 2)); // Add new child.
    if (document.getElementById("flexSwitchCheckDefault").checked == 1) {
        // Check if defense check has been checked.
        activeNode.dis.stroke = color('green');
        activeNode.dis.strokeWeight = 3;
        activeNode.dis.r = shapeRadious;
        activeNode.children.at(-1).dis.lineList = [10,10,10,10];
    }
    activeNode.dis.adjust_textbox();
    activeNode.update_width();
    // windowResized();
    draw();
    IDnumber++;
    notificationSuccess('noti-add', 'noti-body-add', "Child added successfully!"); // Send success notification if node has been added.
}

function manDeleteChild(){
    console.log("[*] In manDeleteChild()");
    if (notificationCheckNode('noti-rem', 'noti-body-rem')) {
        // Send error notification if activeNode is undefined.
        return;
    } 
    root.removeSubTree(activeNode); // Function removeSubtree gives error.
    activeNode = undefined;
    windowResized();
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
    activeNode.dis.adjust_textbox();
    activeNode.update_width();
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
    console.log("whoop");
    var selectedFormat = document.getElementById("formatDropdown").value;
    try {
        var file = await downloadADT(selectedFormat);
        console.log("yayayayay: ", file);
        var input;
        if (selectedFormat === 'json') {
            input = await build_json(file);
            // const visited = new WeakSet();
            // input = JSON.stringify(input, (key, value) => {
            //     if (typeof value === 'object' && value !== null) {
            //         if (visited.has(value)) {
            //             return '[Circular Reference]';
            //         }
            //         visited.add(value);
            //     }
            //     return value;
            // });
            input = Flatted.stringify(input);
            console.log("YA: ", file);
        } else {
            input = file;
        }
        var blob = new Blob([input], { type: "text/plain"});
        var downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        console.log("YA: ", input);
        downloadLink.download = "SavedADT." + selectedFormat;
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
                console.log("JSON: ", file);
                var fileName = file.name;
                var fileExt = fileName.split('.').pop();

                if (fileExt === 'xml') {
                    console.log("XML");
                    resolve(file);
                } else if (fileExt === 'json') {
                    console.log("JSON");
                    resolve(file)
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
    console.log("whoop")
    try {
        var file = await uploadADT();
        var fileExt = file.name.split('.').pop();
        var input;
        if (fileExt === 'xml') {
            input = await getJson(0, file);
            console.log("YA: ", file);
        } else {
            var temp = file;
            console.log("JSON: ", temp);
            input = Flatted.parse(temp);
        }
        buildFromMultiset(input);
        draw();
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

    //console.log("Tobuild: " + toBuild);

    ///console.log(root)

    // First Run of Function
    if(parent == null){
        console.log("hier: ", toBuild);

        root = new ADTree(toBuild[0].label, IDnumber); // Get label of root
        IDnumber++;

        // disRoot = new Display(toBuild[0].label/*adtree.node.label*/, 0, 0, 2); // Added by J
        root.refinement = toBuild[0].refinement;
        root.type = toBuild[0].swith_role;
        // console.log("Root: ", root); // Added by J

        console.log("Keys: " + Object.keys(toBuild[0])); // Added by C

        for(let i = 0; i < Object.keys(toBuild[0]).length-6; i++){ // Loop through all children
            buildFromMultiset(toBuild[0][i], root);
        }

    // Tree Exists, adding subtrees
    } else {

      if(!(toBuild === null || toBuild === undefined) && Object.keys(toBuild).length-7 != 0){ // This was 6, with 7 it works, because 7 array elements for normal intermediate node

            var child = new ADTree(toBuild.label, IDnumber); // Get label of current node
            child.refinement = toBuild.refinement;
            child.type = toBuild.swith_role;
            parent.add_child(child, new Display(toBuild.label, 0, 0, 2));
            IDnumber++;

            for (let i = 0; i < (Object.keys(toBuild).length-7); i++){ // Loop through all children
                buildFromMultiset(toBuild[i], child);
            }

      //Leaf Node
      } else if (!(toBuild == null || toBuild == undefined)){
            var child = new ADTree(toBuild.label, IDnumber); // Get label of child
            child.type = toBuild.swith_role;
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
          root.dis.x = root.dis.width/2;
          root.adjust_children();
        }

        // zoom in/out
        console.log("scaleValue: ", scaleValue); // added by C
        scale(scaleValue);

        clear();

        if (root != null && root != undefined){
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

function showAlert(){
  console.log("[!] TODO: Generate button fixen (Meza!).");
}

function changeCoordinatesRec(newScaleValue, currentNode){
  if (currentNode != null){
    currentNode.dis.scale_x *= newScaleValue;
    currentNode.dis.scale_x_range *= newScaleValue;
    currentNode.dis.scale_y *= newScaleValue;
    currentNode.dis.scale_y_range *= newScaleValue;

  }

  console.log("*** CHANGECOORDINATESREC ***");
  console.log("LABEL: " + currentNode.label);
  console.log("SCALE_X: " + currentNode.dis.scale_x);
  console.log("SCALE_X_RANGE: " + currentNode.dis.scale_x_range);
  console.log("SCALE_Y: " + currentNode.dis.scale_y);
  console.log("SCALE_Y_RANGE: " + currentNode.dis.scale_y_range);


  for (let i = 0; i < currentNode.children.length; i++){
    changeCoordinatesRec(newScaleValue, currentNode.children[i]);
  }
}

function changeCoordinates(newScaleValue){
  console.log("[*] In changeCoordinates()");
  var treeRoot = root;

  changeCoordinatesRec(newScaleValue, treeRoot);

}
