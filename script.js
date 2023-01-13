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

function setup() {
  // noLoop();
  toDraw = true;
  trackMouseStart = true;
  frameRate(60);

  sideFrameWidth = 400;
  var frameX = windowWidth - sideFrameWidth;
  createCanvas(windowWidth, windowHeight);


  sidePanel = createDiv();
  sidePanel.position(frameX, 0);
  sidePanel.style('background-color', 'lightgray')
  sidePanel.style('width', sideFrameWidth)
  sidePanel.style('height', windowHeight)
  var titleDiv = createDiv();
  titleDiv.parent(sidePanel);
  titleDiv.style('text-align', 'center')
  let easyADT = createElement("h1", "Easy ADT")
  easyADT.parent(titleDiv);


  createADTDiv = createDiv();
  createADTDiv.parent(sidePanel);
  createADTDiv.style('text-align', 'center')
  let textArea = createElement("textarea", "");
  textArea.style("width", sideFrameWidth - 40);
  textArea.style("height", (sideFrameWidth - 40)/2.5);
  textArea.parent(createADTDiv);
  console.log(textArea);
  // console.log(textArea);
  let createADTButton = createButton("Create ADT");
  createADTButton.parent(createADTDiv)
  createADTButton.style("width", sideFrameWidth - 80);





  var activeNodeTitleText = "";
  activeNodeTitle = createElement("h2", activeNodeTitleText)
  activeNodeTitle.style('text-align', 'center')
  activeNodeTitle.parent(sidePanel);





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
  textArea.elt.defaultValue = root.getMultiArray()
  // console.log("Depth: ", max_depth(root))
  // console.log("Width: ", max_width(root, 50))
  var example = ["Free Lunch", 0, [["Get Legit Customer to buy lunch for you", 0, [["Promise to Pay back later"], ["Man in the middle attack", 1, [["Tell customer you will pick up their bill"],["Go to counter tell waiter legit customer will pay for you"],["Wave at customer (will wave back in agreement)"]]]]], ["Eat and run", 1, [["Order meal and ask for bill"], ["Leave restaurant", 0, [["Sneak out through bathroom window"], ["Just run..."]]]]], ["Pretend to work at restaurant", 0, [["Ask chef to prepare meal for table n"], ["Salami attack", 1, [["Wait on customers"], ["Collect a little bit of food from each customer's plate"], ["Find place to eat"]]]]]]]
  buildFromMultiset(example);

  // console.log(root);
  scaled = frameX/(root.width*1.2);
  // console.log(scaled)
  // if(scale < 1){
  //   scale(scale);
  // }
  // root.display();
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

function buildFromMultiset(toBuild, parent=null){
  console.log(toBuild)
  console.log(root)
  // First Run of Function
  if(parent == null){
    root = new Tree(toBuild[0], 0, 0, 2);
    root.refinement = toBuild[1];
    for(let i = 0; i < toBuild[2].length; i++){
      buildFromMultiset(toBuild[2][i], root);
    }
  // Tree Exists, adding subtrees
  } else {
    //Intermediate Node
    if(toBuild.length == 3){
      var child = new Tree(toBuild[0], 0, 0, 2);
      child.refinement = toBuild[1];
      parent.add_child(child);
      for(let i = 0; i < toBuild[2].length; i++){
        buildFromMultiset(toBuild[2][i], child);
      }
      //Leaf Node
    } else {
      parent.add_child(new Tree(toBuild[0], 0, 0, 2));
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
    root.x = (width - root.width)/2 + root.width/2;
    root.adjust_children();
    }

    if(activeNode != null){
      activeNodeTitle.elt.innerHTML = activeNode.t;
      // console.log(activeNodeTitle.elt.innerHTML);
      // console.log("Check")

    }




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
  activeNode = clickedNode
  toDraw = true;
  trackMouseStart = true;
  trackNode = null;
}

function windowResized() {
  var frameX = (windowWidth - sideFrameWidth)
  scaled = frameX/(root.width*1.2);
  sidePanel.position(frameX, 0);
  resizeCanvas(windowWidth, windowHeight);
  toDraw  = true;
}
