let root;
let canvasElement;
let canvasWidth;
let canvasHeight;
let canvasParentDiv;
let active = null;
let cX = 0;
let cY = 0;
let mX;
let mY;

async function setup() {
    toDraw = true;
    trackMouseStart = true;
    frameRate(60);
    sideFrameWidth = 400;
    var frameX = windowWidth - sideFrameWidth; // Calculate how big the canvas should be, by compensating for the non-canvas side elements.
    var canvasParentDiv = document.getElementById('canvasContainer');
    // set height and width for the canvas
    canvasWidth = 100
    canvasHeight= 100;
    canvasElement = createCanvas(canvasWidth,canvasHeight);
    noSmooth(); // Removes rounded corners (to properly fill the canvas area)
    // Parent the canvas to the container DIV, this properly places it within the DOM
    canvasElement.parent("canvasContainer");
    // When canvas is clicked, setup to pan the canvas, as opposed to moving a node
    canvasElement.elt.addEventListener('mousedown', () => { if (active!= null) active.toggleContextMenu();
                                                            active = null;
                                                            mX = mouseX;
                                                            mY = mouseY;
                                                          });

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
    // Canvas and line styling
    noSmooth();
    canvasElement.elt.style.borderRadius = "0";
    stroke('darkgray');
    strokeWeight(2);

    // Initialize canvas with 1 node
    root = new ADTree("Target");
    active = root;
    active.toggleContextMenu();

    //    General P5-related setup
    // Tell the canvas to translate all given coordinates to be related to the entire window, not just the canvas. 
    // (so (0,0) is top left of the window, not the canvas. Helps with calculations later.)
    translate(-cX, -cY);
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
  if (active != null)
  active.toggleContextMenu();
  active.toggleContextMenu();
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
        line(node.root.x + node.root.elt.offsetWidth/2 + ((node.children[i-1].root.x + node.children[i-1].root.elt.offsetWidth/2) - (node.root.x + node.root.elt.offsetWidth/2))*refinementDist, // middle of current node - 1/10th x-distance to left node of current pair
             node.root.y + node.root.elt.offsetHeight + (node.children[i-1].root.y - (node.root.y + node.root.elt.offsetHeight))*refinementDist,  // bottom of current node - 1/10th u-distance to top of left node of current pair
             node.root.x + node.root.elt.offsetWidth/2 + ((node.children[i].root.x + node.children[i].root.elt.offsetWidth/2) - (node.root.x + node.root.elt.offsetWidth/2))*refinementDist,  // middle of current node - 1/10th distance to right node of current pair
             node.root.y + node.root.elt.offsetHeight + (node.children[i].root.y - (node.root.y + node.root.elt.offsetHeight))*refinementDist)  // bottom of current node - 1/10th distance to top of left node of current pair
      }
    }
  }
}

function moveNodes(node, moveX, moveY){ // Moves all nodes in tree
  console.log(node.root.x)
  node.root.position(node.root.position().x + moveX, node.root.position().y + moveY); // Move node by moveX and moveY
  console.log(node.root.x)
  node.oldX = node.root.x;
  node.oldY = node.root.y;
  for (let i = 0; i < node.children.length; i++) {
    // recursively call moveNodes on sub-trees
    moveNodes(node.children[i], moveX, moveY);
  }
}

function mouseDragged() { // Called when mouse is clicked and dragged, standard in p5: https://p5js.org/reference/#/p5/mouseDragged
  if (active == null){ // If nothing is active, the user is scrolling the canvas
    clear();
    moveNodes(root, -(mX - mouseX), -(mY - mouseY));
    drawLines(root);
    mX = mouseX;
    mY = mouseY;
  } else { // if a node is active, drag around the node
    clear();              // Clears all drawn pixels off the canvas
    drawLines(root);      // Recurively re-draw lines every frame while dragging (as inneficient as it is, you can't re-draw an individual line while dragging)
    active.setPos(mouseX,mouseY);
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

function keyPressed() { // Temporary: bind anything to happen when clicking left arrow
  if (keyCode == LEFT_ARROW) {
    console.log("style " + root.Refinebtn.style('width'))
    console.log("offset " + root.Refinebtn.elt.offsetWidth)
  }
}