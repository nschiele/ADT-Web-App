let root; // The first node that is always placed.
let canvasElement; // Holds the canvas, can be used anywhere to point directly to the canvas.
let canvasWidth = 100;
let canvasHeight= 100;
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

let allNodes = [];

async function setup() { // Only called once: https://p5js.org/reference/#/p5/setup
  toDraw = true;
  trackMouseStart = true;
  frameRate(60);
  sideFrameWidth = 400;
  var frameX = windowWidth - sideFrameWidth; // Calculate how big the canvas should be, by compensating for the non-canvas side elements.
  var canvasParentDiv = document.getElementById('canvasContainer');
  // set initial height and width for the canvas (will be resized to fit full screen.)
  canvasElement = createCanvas(canvasWidth,canvasHeight);
  noSmooth(); // Removes rounded corners (to properly fill the canvas area)
  // Parent the canvas to the container DIV, this properly places it within the DOM
  canvasElement.parent("canvasContainer");
  // When canvas (or anything that is not a node, like side/top/bottom bars) is clicked, setup to pan the canvas, as opposed to moving a node
  let nonInteractableElements = [document.getElementById("sidebarMenu"),
                                 document.getElementById("topBar"),
                                 canvasElement.elt, document.getElementById("canvTopBar"),
                                 document.getElementById("botFooter")];
  for (let i = 0; i < nonInteractableElements.length; i++){ // loop over nonInteractables
    nonInteractableElements[i].addEventListener('mousedown', () => // when clicked DOWN, unset active. And store the old active in lastActive
    { 
      lastActive = active;
      active = null; // active = null means that when mouse is dragged sufficient distance, the canvas is dragged.
      mX = mouseX;
      mY = mouseY;
      canvasOldX = mouseX;
      canvasOldY = mouseY;
      allowDragging = (nonInteractableElements[i] == canvasElement.elt); // Allow dragging only if dragging the canvas, so non-canvas elts
                                                                         // are ignored
    });
      

    nonInteractableElements[i].addEventListener('mouseup', () =>  // when clicked UP (released click), set active back to old active like nothing happened.
    { 
      if (mouseX == canvasOldX && mouseY == canvasOldY ){ // If NO dragging occured, simply unselect the selected node (like clicking away from a node to stop selecting it)
        if (lastActive != null){
          lastActive.toggleContextMenu();
          lastActive = null;
        }
        if (active != null)
          active = null;
      } else {
        if (lastActive != null){
          active = lastActive;
          lastActive = null;
        }
      }
    });
  }

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
  allNodes.push(root);
  active = root;
  active.toggleContextMenu();
  // for (let i = 0; i < 100; i++)
  //   root.addChild();

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
  if (active != null){
    active.toggleContextMenu();
    active.toggleContextMenu();
  }
}


function manAddChild(inputVal) { // Manually add a child, inputVal is a string to be given as the text-content of the created node.
  childTree = new ADTree(inputVal);
}

function drawLines(node){ // Recursively draw all lines between all nodes and their children
  for (let i = 0; i < node.children.length; i++) {
    if (node.children[i] != undefined){ // Only consider children that were not deleted
      if (node.children[i].isDefense != node.isDefense)
        drawingContext.setLineDash([5]);
      // Draw line between root of sub-tree and child i
      line(node.root.x + node.root.elt.offsetWidth/2, node.root.y + node.root.elt.offsetHeight, node.children[i].root.x + node.children[i].root.elt.offsetWidth/2, node.children[i].root.y);
      // recursively call drawLines on sub-trees
      drawLines(node.children[i]);
      if (i > 0){
        if (node.refinementIsAnd){
          if (node.children[i].isDefense == node.children[i-1].isDefense)
            line(node.root.x + node.root.elt.offsetWidth/2 + ((node.children[i-1].root.x + node.children[i-1].root.elt.offsetWidth/2) - (node.root.x + node.root.elt.offsetWidth/2))*refinementDist, // middle of current node - 1/10th x-distance to left node of current pair
                node.root.y + node.root.elt.offsetHeight + (node.children[i-1].root.y - (node.root.y + node.root.elt.offsetHeight))*refinementDist,  // bottom of current node - 1/10th u-distance to top of left node of current pair
                node.root.x + node.root.elt.offsetWidth/2 + ((node.children[i].root.x + node.children[i].root.elt.offsetWidth/2) - (node.root.x + node.root.elt.offsetWidth/2))*refinementDist,  // middle of current node - 1/10th distance to right node of current pair
                node.root.y + node.root.elt.offsetHeight + (node.children[i].root.y - (node.root.y + node.root.elt.offsetHeight))*refinementDist)  // bottom of current node - 1/10th distance to top of left node of current pair
        }
      }
      drawingContext.setLineDash([0]);
    }
  }
}

function moveNodes(node, moveX, moveY){ // Moves all nodes in tree
  node.root.position(node.root.position().x + moveX, node.root.position().y + moveY); // Move node by moveX and moveY
  if (node.contextEnabled){
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

function checkLocalTree(node){ // Check 1 layer above and below current tree
  if (node.parent) checkNode(node.parent)
  checkNode(node)
}

function checkNode(node){
  for (let i = 0; i < node.children.length; i++)
    node.children[i].root.removeClass('ErrorNode')
  let counterMeasures = []
  for (let i = 0; i < node.children.length; i++)
    if (node.children[i].isDefense != node.isDefense)
      counterMeasures.push(i)
  if (counterMeasures.length > 1){
    for (let childID of counterMeasures){
      node.children[childID].root.addClass('ErrorNode')
    }
    return false
  } else
    return true
}

function mouseDragged() { // Called when mouse is clicked and dragged, standard in p5: https://p5js.org/reference/#/p5/mouseDragged
  if (allowDragging)
    if (active == null){ // If nothing is active, the user is scrolling the canvas
      if ((canvasOldX - mouseX) > 25 || (canvasOldX - mouseX) < -25 || (canvasOldY - mouseY) > 25 || (canvasOldY - mouseY) < -25){
        canvasOldX = -100; // Once any dragging has occured (user dragged far enough), stop keeping track of where drag started. Otherwise, whenever you move cursor back
        canvasOldY = -100; // into the starting area of the drag, it momentarily stops dragging. By moving off screen, cursor is always outside margin once dragging starts.
        clearTextSelection();
        moveNodes(root, -(mX - mouseX), -(mY - mouseY));
        clear();
        drawLines(root);
        mX = mouseX;
        mY = mouseY;
      }
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

function keyPressed() { // Temporary: bind anything to happen when clicking left arrow, for debugging
  if (keyCode == LEFT_ARROW) {
    console.log(root.children)
    checkLocalTree(root)
    // drawLines(root)
    console.log('checking tree')
  }
}