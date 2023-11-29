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
let active = null;

var IDnumber = 1; // Added by J

let cX = 0;
let cY = 0;

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
    canvasWidth = 100
    canvasHeight= 100;

    // the main canvas area where the tree will go
    canvasElement = createCanvas(canvasWidth,canvasHeight);
    noSmooth();
  
    
    // set parent div
    canvasElement.parent("canvasContainer");

    /* windowWidth/Height is in pixels; the width and height of window (not the entire display, just the html DOM!)
     * sticky-top is the class of the top bar. canvTopBar is the id of the buttons right above the canvas. (zoom in, out, export, import, etc.). 
     * The heights of these elements are considered when setting canvas position and dimensions.
     * 0.25 is used to multiply the width, since the left-sidebar has a width of 25%.
     */
    canvasElement.position(windowWidth*0.25, select("#topBar").offsetHeight + select("#canvTopBar").offsetHeight);
    
    cX = canvasElement.position().x;
    cY = canvasElement.position().y;
    resizeCanvas(windowWidth-cX, windowHeight-cY-document.getElementById('botFooter').offsetHeight);
    noSmooth();
    console.log(windowWidth, cX, windowHeight, cY);
    
    /* styling canvas */
    // canvasElement.elt.style.backgroundColor = "blue";
    canvasElement.elt.style.borderRadius = "0";
    // canvasElement.elt.style.border = "2px solid pink";

    // mainTree contains all the sub-trees of children. Aka: Root node.
    // mainTree = new ADTree("test");
    // manAddChild("testInput!");
}

function windowResized() {
  canvasElement.position(windowWidth*0.25, select("#topBar").offsetHeight + select("#canvTopBar").offsetHeight);
  cX = canvasElement.position().x;
  cY = canvasElement.position().y;
  resizeCanvas(windowWidth-cX, windowHeight-cY-document.getElementById('botFooter').offsetHeight, true);
}

// function createNode(inputVal) {
//   if (inputVal == null) { // if input NOT given, use nodeChildTextInput. Else, use input.
//     textVal = select("#nodeChildTextInput").elt.value;
//     if (!textVal) // if nodeChildTextInput empty, use placeholder
//         inp = createInput("Placeholder");
//     else
//         inp = createInput(textVal);
//   } else {
//       inp = createInput(inputVal);
//   } 
//   inp.addClass('Node'); // add styling
//   inp.position(canvasElement.position().x, canvasElement.position().y) // set pos to top-left of canvas
//   inp.mouseClicked(scream);
//   childTree = new ADTree(inp);
//   return childTree;
// }

function manAddChild(inputVal) { // inputVal is a string
  // mainTree.addChild(createNode(inputVal));
  childTree = new ADTree(inputVal);
}

// function scream() {
//   // super.test();
// }

function mouseDragged() {
  if (active != null){
    active.setPos(mouseX,mouseY);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    console.log(active);
  }
}