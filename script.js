let root;
let scaled;
let toDraw;
let sideFrameWidth;


let activeNode;
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

async function setup() {
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
  
  // save canvas
  var saveBtnPng = select('#pngBtn');
  var saveBtnJpg = select('#jpgBtn');
  var downloadBtn = select("#downloadBtn")
  saveBtnPng.mousePressed(downloadCanvasPng);
  saveBtnJpg.mousePressed(downloadCanvasJpg);
  downloadBtn.mousePressed(downloadCanvasJpg);

  // print 
  var printBtn = select('#printBtn');
  printBtn.mousePressed(printCanvas);
  // canvasElement.style("padding","3%")

    // sketchCanvas.parent("canvasContainer");
  // sidePanel = createDiv();
  // sidePanel.position(frameX, 0);
  // sidePanel.style('background-color', 'lightgray')
  // sidePanel.style('width', sideFrameWidth)
  // sidePanel.style('height', windowHeight)
  // var titleDiv = createDiv();
  // titleDiv.parent(sidePanel);
  // titleDiv.style('text-align', 'center')
  // let easyADT = createElement("h1", "Easy ADT")
  // easyADT.parent(titleDiv);


  // createADTDiv = createDiv();
  // createADTDiv.parent(sidePanel);
  // createADTDiv.style('text-align', 'center')
  // let textArea = createElement("textarea", "");
  // textArea.style("width", sideFrameWidth - 40);
  // textArea.style("height", (sideFrameWidth - 40)/2.5);
  // textArea.parent(createADTDiv);
  // console.log(textArea);
  // console.log(textArea);
  // let createADTButton = createButton("Create ADT");
  // createADTButton.parent(createADTDiv)
  // createADTButton.style("width", sideFrameWidth - 80);





  // var activeNodeTitleText = "";
  // activeNodeTitle = createElement("h2", activeNodeTitleText)
  // activeNodeTitle.style('text-align', 'center')
  // activeNodeTitle.parent(sidePanel);




/*
  root = new Tree("Rob first Bank", 800, 400, 2);






  // console.log("Depth: ", max_depth(root))
  // console.log("Width: ", max_width(root, 50))
  root.add_child(new Tree("Physical Attack"))
  root.add_child(new Tree("Psychic Attack"))
  root.add_child(new Tree("Computer Attack"))
  // console.log("Depth: ", max_depth(root))
  // console.log("Width: ", max_width(root, 50))
  root.children[0].add_child(new Tree("Pikachu"))
  root.children[0].add_child(new Tree("Tangela"))
  root.children[0].add_child(new Tree("Garydos"))
  root.children[0].add_child(new Tree("Fearow"))
  root.children[1].add_child(new Tree("Abra"))
  root.children[1].add_child(new Tree("Alakazam"))
  root.children[2].add_child(new Tree("Machamp"))
  root.children[2].add_child(new Tree("Gengar"))
    // console.log("Depth: ", max_depth(root))
    // console.log("Width: ", max_width(root, 50))
  root.refinement = 1;
  root.children[1].refinement = 1;
  root.children[0].refinement = 1;
  root.children[2].refinement = 1;
  root.children[1].children[0].refinement = 1;
  root.children[1].children[0].add_child(new Tree("OH WOW WOWOWOWOWOWOOW OW WOW WOWOWOW OWOWOOW"))
  root.children[1].children[0].add_child(new Tree("test"))
  root.children[1].children[0].add_child(new Tree("TEST TEST TEST"))
  root.children[1].children[0].add_child(new Tree("CHEESE"))
  root.children[0].children[0].add_child(new Tree("CHEESE"))
  root.children[0].children[0].add_child(new Tree("CHEESE"))
  console.log(root.getMultiArray());
  canvasElement.elt.defaultValue = root.getMultiArray()
  // console.log("Depth: ", max_depth(root))
  // console.log("Width: ", max_width(root, 50))
  */
  var example = await getJson(0, null); // Call json_junc.js
  
  buildFromMultiset(example);
  console.log(getJson(1, example));

  // console.log(root);
  scaled = frameX/(root.width*1.2);
  // console.log(scaled)
  // if(scale < 1){
  //   scale(scale);
  // }
  // root.display();
}

function zoomInFunction(){
  scaleValue = scaleValue + 1
}
function zoomOutFunction(){
  if(scaleValue == 1)
  scaleValue = 1;
  else
  scaleValue = scaleValue - 1;
}

function btnChangeNodeText(){
  var newNodeText = select("#nodeTextInput").value();
  // to be continued
}
function changeNodeOutlineColorShape(shapeRadious,shapeColor){
    nodeOutLineColor = true;
    activeNode.stroke = color(shapeColor);
    activeNode.strokeWeight = 3;
    activeNode.r = shapeRadious;
}

function changeNodeLineToContinueLine(){
  activeNode.lineList = [0];
}
function changeNodeLineToDashed() {
  activeNode.lineList = [10,10,10,10];
}

function downloadCanvasPng(){
  fileName = select("#treeName").value();
  console.log(fileName);
  saveCanvas(canvasElement, fileName, 'png');
}
function downloadCanvasJpg(){
  fileName = select("#treeName").value();
  console.log(fileName);
  saveCanvas(canvasElement, fileName, 'jpg');
}

function printCanvas(){
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
  example = [[],0,[]];
  buildFromMultiset(example);
}
function max_depth(n){
  if(n.children.length == 0){
    return n.level;
  } else {
    var toReturn = n.level;
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
  var toReturn = n.x_range;
  var curr_level = 0;
  var curr_width = -1*dist;
  var searchOrder = [];

  searchOrder.push(n);
  for(let i = 0; i < searchOrder.length; i++){
    for(let j = 0; j < searchOrder[i].children.length; j++){
      searchOrder.push(searchOrder[i].children[j]);
    }
    // console.log(searchOrder[i], searchOrder)
    if(searchOrder[i].level == curr_level){ //Still on same level
      curr_width += searchOrder[i].x_range;
      curr_width += dist;
      // console.log("Same Level: ", searchOrder[i].level, curr_level, toReturn)
    } else { //Now searching the next level
      // console.log("New Level: ", searchOrder[i].level, curr_level, toReturn)
      if(toReturn < curr_width){
        toReturn = curr_width;
      }
      curr_width = searchOrder[i].x_range;
      curr_level = searchOrder[i].level;

    }
    // console.log(searchOrder[i], searchOrder[i].x_range, curr_width, curr_level, toReturn)
  }
  if(toReturn < curr_width){
    toReturn = curr_width;
  }
  return toReturn;
}

async function buildFromMultiset(toBuild, parent=null){
  // console.log(root)
  // First Run of Function
  if(parent == null){
    root = new Tree(toBuild[0].label/*adtree.node.label*/, 0, 0, 2); // Get label of root
    root.refinement = toBuild[0].refinement;
    for(let i = 0; i < Object.keys(toBuild[0]).length-6; i++){ // Loop through all children
      buildFromMultiset(toBuild[0][i], root);
    }
  // Tree Exists, adding subtrees
  } else {
    //Intermediate Node
    if(Object.keys(toBuild).length-6 != 0){
      var child = new Tree(toBuild.label, 0, 0, 2); // Get label of child
      child.refinement = toBuild.refinement;
      parent.add_child(child);
      for(let i = 0; i < (Object.keys(toBuild).length-6); i++){ // Loop through all children
        buildFromMultiset(toBuild[i], child);
      }
      //Leaf Node
    } else {
      parent.add_child(new Tree(toBuild.label, 0, 0, 2));
    }
  }
}

function draw(){
  // If ADT is larger than the canvas, shrink ADT and place in center
  if(toDraw){
    if(scaled < 1){
      scale(scaled);
      root.x = root.width/2;
      root.adjust_children();
    } else {
    console.log("mama mia", width);
    root.x = (width - root.width)/2 + root.width/2;
    root.adjust_children();
    }

    if(activeNode != null){
      // activeNodeTitle.elt.innerHTML = activeNode.t;
      oldNodetext = activeNode.t;
      select("#nodeTextInput").attribute("value", activeNode.t);
      // console.log(activeNodeTitle.elt.innerHTML);
      // console.log("Check")

    }
    // zoom in/out
    scale(scaleValue);

    clear();
    root.display();
    toDraw =false;
  }
  // console.log(root.getActive())
  //What node is the mouse currently over
  var mouseNode = root.checkCoordinates(mouseX/scaled, mouseY/scaled);

  //If the mouse is hoving over a node
  if(mouseNode != null && mouseNode != hoverNode){
    // console.log(root.checkCoordinates(mouseX/scaled, mouseY/scaled))
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
    // console.log("Registering Mouse Press", startMouseX - mouseX, startMouseY - mouseY, trackNode.x, trackNode.y);
  }
}

function mouseReleased(){
  var clickedNode = trackNode;
  root.clearActive();
  // console.log(clickedNode);
  // console.log(clickedNode, mouseX/scaled, mouseY/scaled);
  if(clickedNode != null){
    clickedNode.active = true;
  }
  activeNode = clickedNode;
  toDraw = true;
  trackMouseStart = true;
  trackNode = null;
}

function windowResized() {
  var frameX = (windowWidth - sideFrameWidth)
  scaled = frameX/(root.width*1.2);
  sidePanel.position(frameX, 0);
  console.log("size: ", windowWidth, windowHeight);
  resizeCanvas(windowWidth, windowHeight);
  // resizeCanvas(canvasWidth,canvasHeight);
  toDraw  = true;
}
