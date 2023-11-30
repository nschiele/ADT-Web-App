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

let mX;
let mY;
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
  
    
    // Parent the canvas to the container DIV, this properly places it within the window
    canvasElement.parent("canvasContainer");
    canvasElement.elt.addEventListener('mousedown', () => { mX = mouseX; mY = mouseY; active = canvasElement; console.log(mouseX, mouseY)});

    /* windowWidth/Height is in pixels; the width and height of window (not the entire display, just the html DOM!)
     * sticky-top is the class of the top bar. canvTopBar is the id of the buttons right above the canvas. (zoom in, out, export, import, etc.). 
     * The heights of these elements are considered when setting canvas position and dimensions.
     * 0.25 is used to multiply the width, since the left-sidebar has a width of 25%.
     */
    select("#canvTopBar").position(windowWidth*0.25, select("#topBar").offsetHeight);
    canvasElement.position(windowWidth*0.25, select("#topBar").offsetHeight + select("#canvTopBar").offsetHeight+26);
    
    cX = canvasElement.position().x;
    cY = canvasElement.position().y;
    resizeCanvas(windowWidth-cX, windowHeight-cY-document.getElementById('botFooter').offsetHeight);
    noSmooth();
    console.log(windowWidth, cX, windowHeight, cY);
    
    /* styling canvas */
    // canvasElement.elt.style.backgroundColor = "blue";
    canvasElement.elt.style.borderRadius = "0";

    // Initialize canvas with 1 node
    root = new ADTree("Target");

    //    General P5-related setup
    // Tell the canvas to translate all given coordinates to be related to the entire window, not just the canvas. (so (0,0) is top left of the window, not the canvas. Helps with calculations later.)
    translate(-cX, -cY);
    // Color and thickness of lines between nodes
    stroke('darkgray');
    strokeWeight(2);
}


function windowResized() { // Called whenever window is resized, standard in p5: https://p5js.org/reference/#/p5/windowResized
  canvasElement.position(windowWidth*0.25, select("#topBar").offsetHeight + select("#canvTopBar").offsetHeight+26);
  resetMatrix(); // Reset any translation
  moveNodes(root, -(cX - canvasElement.position().x), -(cY - canvasElement.position().y));
  cX = canvasElement.position().x;
  cY = canvasElement.position().y;
  select("#canvTopBar").position(windowWidth*0.25, select("#topBar").offsetHeight);
  resizeCanvas(windowWidth-cX, windowHeight-cY-document.getElementById('botFooter').offsetHeight, true);
  translate(-cX,-cY); // Re-translate relative to new canvas position
  drawLines(root); // Re-draw all lines, since they are deleted by resizeCanvas
}


function manAddChild(inputVal) { // Manually add a child, inputVal is a string to be given as the text-content of the created node.
  childTree = new ADTree(inputVal);
}

function drawLines(node){ // Recursively draw all lines between all nodes and their children
  for (let i = 0; i < node.children.length; i++) {
    // Draw line between root of sub-tree and child i
    line(node.root.x + node.root.elt.offsetWidth/2, node.root.y + node.root.elt.offsetHeight, node.children[i].root.x + node.children[i].root.elt.offsetWidth/2, node.children[i].root.y);
    // recursively call drawLines on sub-trees
    drawLines(node.children[i]);
    if (i > 0){
      if (node.refinementIsAnd){
        line(node.root.x + node.root.elt.offsetWidth/2 + ((node.children[i-1].root.x + node.children[i-1].root.elt.offsetWidth/2) - (node.root.x + node.root.elt.offsetWidth/2))/10, // middle of current node - 1/10th x-distance to left node of current pair
             node.root.y + node.root.elt.offsetHeight + (node.children[i-1].root.y - (node.root.y + node.root.elt.offsetHeight))/10,  // bottom of current node - 1/10th u-distance to top of left node of current pair
             node.root.x + node.root.elt.offsetWidth/2 + ((node.children[i].root.x + node.children[i].root.elt.offsetWidth/2) - (node.root.x + node.root.elt.offsetWidth/2))/10,  // middle of current node - 1/10th distance to right node of current pair
             node.root.y + node.root.elt.offsetHeight + (node.children[i].root.y - (node.root.y + node.root.elt.offsetHeight))/10)  // bottom of current node - 1/10th distance to top of left node of current pair
      }
    }
  }
}

function moveNodes(node, moveX, moveY){ // Moves all nodes in tree
  node.root.position(node.root.x + moveX, node.root.y + moveY); // Move node by moveX and moveY
  node.oldX = node.root.x;
  node.oldY = node.root.y;
  for (let i = 0; i < node.children.length; i++) {
    // recursively call moveNodes on sub-trees
    moveNodes(node.children[i], moveX, moveY);
  }
}

function mouseDragged() { // Called when mouse is clicked and dragged, standard in p5: https://p5js.org/reference/#/p5/mouseDragged
  if (active != null){ 
    console.log(active);
    if (active == canvasElement){ // If the canvas is activing, the user is scrolling the canvas
      console.log("clear")
      clear();
      moveNodes(root, -(mX - mouseX), -(mY - mouseY));
      drawLines(root);
      mX = mouseX;
      mY = mouseY;
    } else { // if a node is active, drag around the node
      console.log("clear")
      clear();              // Clears all drawn pixels off the canvas
      drawLines(root);      // Recurively re-draw lines every frame while dragging (as inneficient as it is, you can't re-draw an individual line while dragging)
      active.setPos(mouseX,mouseY);
    }
  }
}

function keyPressed() { // Temporary: bind anything to happen when clicking left arrow
  if (keyCode === LEFT_ARROW) {
    root.root.elt.focus();
    active.refinementIsAnd = !active.refinementIsAnd;
    clear();
    drawLines(root);
    console.log(active);
  }
}