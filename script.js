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
  canvasElement = createCanvas(canvasWidth,canvasHeight);
  noSmooth(); // Removes rounded corners (to properly fill the canvas area)
  // Parent the canvas to the container DIV, this properly places it within the DOM
  canvasElement.parent("canvasContainer");
  // When canvas (or anything that is not a node, like side/top/bottom bars) is clicked, setup to pan the canvas, as opposed to moving a node
  let nonInteractableElements = [
    document.getElementById("sidebarMenu"),
    document.getElementById("topBar"),
    canvasElement.elt,
    document.getElementById("canvTopBar"),
    document.getElementById("botFooter")
  ];
  disableNonInteractables(nonInteractableElements);

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

  let warningIcon = document.getElementById('btn-groupwarningIcon');
  warningIcon.addEventListener('click', setupWarningMessages)

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
  childTree.root.addClass('NodeActiveAtk')
}

function drawLines(node){ // Recursively draw all lines between all nodes and their children
  let lastFoundSameTypeChildIndex = null;
  for (let i = 0; i < node.children.length; i++) {
    console.log("enter loop", i);
    if (node.children[i] && node.children[i].isDefense != node.isDefense)
      drawingContext.setLineDash([5]);
    // Draw line between root of sub-tree and child i
    line(node.root.x + node.root.elt.offsetWidth/2, node.root.y + node.root.elt.offsetHeight, node.children[i].root.x + node.children[i].root.elt.offsetWidth/2, node.children[i].root.y);
    // recursively call drawLines on sub-trees
    drawingContext.setLineDash([0]);
    drawLines(node.children[i]);
    if (node.refinementIsAnd)
      if (node.children[i].isDefense == node.isDefense){
        if (lastFoundSameTypeChildIndex != null){
          line(node.root.x + node.root.elt.offsetWidth/2 + ((node.children[lastFoundSameTypeChildIndex].root.x + node.children[lastFoundSameTypeChildIndex].root.elt.offsetWidth/2) - (node.root.x + node.root.elt.offsetWidth/2))*refinementDist, // middle of current node - 1/10th x-distance to left node of current pair
                node.root.y + node.root.elt.offsetHeight + (node.children[lastFoundSameTypeChildIndex].root.y - (node.root.y + node.root.elt.offsetHeight))*refinementDist,  // bottom of current node - 1/10th u-distance to top of left node of current pair
                node.root.x + node.root.elt.offsetWidth/2 + ((node.children[i].root.x + node.children[i].root.elt.offsetWidth/2) - (node.root.x + node.root.elt.offsetWidth/2))*refinementDist,  // middle of current node - 1/10th distance to right node of current pair
                node.root.y + node.root.elt.offsetHeight + (node.children[i].root.y - (node.root.y + node.root.elt.offsetHeight))*refinementDist)  // bottom of current node - 1/10th distance to top of left node of current pair
        }
        lastFoundSameTypeChildIndex = i; // Keep track of last found non-CounterMeasure child
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

function disableNonInteractables(listOfElements){
  for (let i = 0; i < listOfElements.length; i++){ // loop over nonInteractables
    // Handle click DOWN
    listOfElements[i].addEventListener('mousedown', () => // when clicked DOWN, unset active. And store the old active in lastActive
    { 
    mX = mouseX;
    mY = mouseY;
    canvasOldX = mouseX;
    canvasOldY = mouseY;
    allowDragging = (listOfElements[i] == canvasElement.elt); // Allow dragging only if dragging the canvas, so non-canvas elts
                                                                       // are ignored
    if (allowDragging){
      lastActive = active;
      active = null;
    }
  });
  // Handle click UP
  listOfElements[i].addEventListener('mouseup', () =>  // when clicked UP (released click), set active back to old active like nothing happened.
  { 
    if (allowDragging){
      active = lastActive;
      lastActive = null;
    }
    if (listOfElements[i] == canvasElement.elt && mouseX == canvasOldX && mouseY == canvasOldY){
      if (lastActive != null)
        lastActive.toggleContextMenu();
      if (active != null)
        active.toggleContextMenu();
      lastActive = null;
      active = null;
    }
  });
  }
}

function setupWarningMessages(){ // Handles behaviour when clicking warning icon
                                 // It's a little ugly, but it's a lot easier than (un)hiding a pre-made error with dynamic content :)
  let warningsDiv = createDiv();
  warningsDiv.addClass('warningDiv');
  warningsDiv.position(select("#topBar").offsetHeight,0);

  let warningsDivBody = createDiv();
  warningsDivBody.addClass('warningDivBody');
  warningsDiv.position(select("#topBar").offsetHeight,0);
  warningsDivBody.parent(warningsDiv);

  let ErrorPElements = [];
  // Create error header and apply styling
  let mainP = createP('One or more nodes have an error, the current tree is wrong.');
  mainP.parent(warningsDivBody);
  mainP.addClass('ErrorHeading');
  // Counter-measure overflow message
  if (CMOverflow){
    let CMOP = createP('Too many counter-measures per node. Counter-measures are nodes of a different type than their parent node.')
    CMOP.parent(warningsDivBody);
    ErrorPElements.push(CMOP);
  }
  // Apply styling to all error messages
  for (const child of ErrorPElements){
    child.addClass('ErrorMessage');
  }

  warningsDiv.elt.addEventListener('click', () => {
    // Clean up when clicking out of notification box
    for (const element of ErrorPElements){
      element.remove();
    }
    mainP.remove();
    warningsDivBody.remove();
    warningsDiv.remove();
  })

}

function treeCheck(){ // Should be called whenever something happens that can cause an error (like toggle atk/def of a node)
  // Errors / warnings list initialization:
  CMOverflow = false; // Error: Counter-measure overflow (>1 counter-measure)
  

  // Run check with error list
  subtreeCheck(root, CMOverflow);

  //Display errors
  if (CMOverflow){
    document.getElementById('btn-groupwarningIcon').style.display = 'block';
  } else {
    document.getElementById('btn-groupwarningIcon').style.display = 'none';
  }
}

function subtreeCheck(node){
  let counterMeasures = []; // List of counter-measures for current node (if len > 1, CMOverflow)


  //  Setup for error checks
  // Setup CMOverflow
  for (const child of node.children){
    child.root.removeClass('ErrorNode'); // Assume no errors, then recheck tree
    if (child.isDefense != node.isDefense)
      counterMeasures.push(child);
  }
  //  Execute error checks
  // Check CMOverflow
  if (counterMeasures.length > 1){
    for (const errorChild of counterMeasures)
      errorChild.root.addClass('ErrorNode');

    CMOverflow = true;
  }

  // Continue with subtrees
  for (const child of node.children)
    subtreeCheck(child)
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

function calcAngle(main, sub){
  return ((Math.atan2(sub.root.x - main.root.x, main.root.y - sub.root.y) * (180 / Math.PI)+360)%360);

}

function keyPressed() { // Temporary: bind anything to happen when clicking left arrow, for debugging
  if (keyCode == LEFT_ARROW) {
    console.log(root.children.length)
  }
  if (keyCode == RIGHT_ARROW) {
    let sub = active;
    let main = root;
    console.log((Math.atan2(sub.root.y - main.root.y, sub.root.x - main.root.x) * (180 / Math.PI) + 360)%360);
  }
}