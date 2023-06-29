class Tree {
  constructor(text, x = 0, y = 0, radius = 2, dist = 50){
    this.x = x;
    this.y = y;
    this.t = text;
    this.r = radius;
    this.x_range; //X_range of just this node
    this.width; //Total width of the subtree
    this.y_range;
    this.lines = 1;
    this.level = 0;
    this.children = [];
    this.parent = null;
    this.root = this;
    this.refinement = 0; //defaults to OR;
    this.dist = dist;//Distance of children
    this.active = false; //Checks if node is currently selected
    this.hover = false;
    this.c = color(255, 255, 255);
    this.stroke = color("black");
    this.strokeWeight = 2;
    this.lineList = [1]; // dashed lines
    this.freeMove = false; //Tracks if the node is unlocked and can move freely
    // console.log(this.x)

    var let_width;
    var let_height;
    var text_space;
    if(this.t.length < 20){
      textSize(32);
      let_height = 30;
      text_space = this.t.length/2;
    } else {
      textSize(16);
      let_height = 20;
      text_space = this.t.length/2;
    }

    if(this.t.length > 40){
      console.log(this.t)
      for(let i = parseInt(this.t.length/2 - 10); i<parseInt(this.t.length/2 + 10); i++){
        console.log(i, this.t[i])
          //First space in the middle of the text
          if(this.t[i] == ' '){
            var newString = this.t.slice(0, i) + '\n' + this.t.slice(i+1, this.t.length);
            this.t = newString
            break;
          }

        }
      }


    if(this.t.includes("\n")){
      var nlSplit = this.t.split("\n");
      var longest = 0;
      for(let i = 0; i < nlSplit.length; i++){
        if(nlSplit[i].length > nlSplit[longest].length){
          longest = i;
        }
        this.lines = nlSplit.length;
        console.log(longest, nlSplit)
      }
      this.x_range = textWidth(nlSplit[longest]) + text_space;
    } else {
      this.x_range = textWidth(this.t) + text_space;
    }
    this.y_range = let_height * this.lines;
    this.width = this.x_range;

  }

  getMultiArray(){
    var toReturn = [this.t];

    if(this.children.length > 0){
      toReturn.push(this.refinement);
      toReturn.push([]);
      for(let i = 0; i < this.children.length; i++){
        toReturn[2].push(this.children[i].getMultiArray());
      }
    }
    return toReturn;
  }

  adjust_text(){
    console.log("text: ", this.t);
    if(this.t.length > 40){
      for(let i = parseInt(this.t.length/2 - 10); i<parseInt(this.t.length/2 + 10); i++){
          //First space in the middle of the text
          if(this.t[i] == ' '){
            var newString = this.t.slice(0, i) + '\n' + this.t.slice(i+1, this.t.length);
            this.t.length = newString
          }
          break;
        }
      }
  }
  //Updates Child Width of node
  update_width(){
    var child_width = -1*this.dist;
    for(let i = 0; i < this.children.length; i++){
      child_width += this.children[i].width + this.dist;
    }
    if(child_width > this.x_range){
          this.width = child_width;
    }
    if(this.parent != null){
      this.parent.update_width();
    }

  }

  add_child(n){
    n.parent = this;
    n.root = this.root;
    // while(n.root.parent != null){
    //     n.root = n.root.parent;
    // }
    this.children.push(n);
    // if(this.children.length == 1){
    //   this.children[0].x = this.x;
    // } else if (this.children.length % 2 == 0){
    //   for(let i = 0; i < this.children.length/2; i++){
    //     console.log(this.x - (this.children[i].x_range - 50)*(this.children.length/2 - i))
    //     this.children[i].x = this.x - (this.children[i].x_range - 50)*(this.children.length/2 - i);
    //   }
    //   for(let i = this.children.length/2; i<this.children.length; i++){
    //     this.children[i].x = this.x + (this.children[i].x_range + 50)*(this.children.length/2 + i);
    //   }
    // }
    this.update_width();
      //Handling Width
    this.root.adjust_children();
    }


  checkCoordinates(x, y){
    if(x >= this.x && x <= this.x + this.x_range && y >= this.y && y <= this.y + this.y_range){
      this.hover = true;
      return this;
    } else {
      // console.log(this.x, x, this.x + this.x_range, "  ", this.y, y, this.y + this.y_range)
      this.hover = false;
      for(let i = 0; i < this.children.length; i++){
        var toReturn = this.children[i].checkCoordinates(x, y);
        if(toReturn != null){
          return toReturn
        }
      }
      return null;
    }

  }

  clearActive(){
    this.active = false;
    for(let i = 0; i < this.children.length; i++){
      this.children[i].clearActive();
    }
  }

  getActive(){
    if(this.active == true){
      return this;
    } else {
      for(let i = 0; i<this.children.length; i++){
        var toReturn = this.children[i].getActive();
        if(toReturn != null){
          return toReturn;
        }
      }
      return null;
    }
  }

    //Adjusts the locations of children dependent on size
  adjust_children(){

      var curr_x = this.x + this.x_range/2 - this.width/2;
      // console.log(this.child_width(dist))
      for(let i = 0; i < this.children.length; i++){
        //Handling Child X Location
        this.children[i].x = curr_x;
        // if(this.children[i].children.length == 0){
          this.children[i].x += this.children[i].width/2
          this.children[i].x -= this.children[i].x_range/2
        // }
        curr_x += this.children[i].width + this.dist;
        //Handling Child Y Location
        this.children[i].y = this.y + 100;
        this.children[i].level = this.level + 1;
        console.log("AAA", curr_x);
    }
    for(let i = 0; i < this.children.length; i++){
      this.children[i].adjust_children();
    }

  }

  set_refinement(r){
    this.refinement = r;
  }


  // reset the lines at the end of the draw
  resetLines() {
    stroke("black");
    strokeWeight(1);
  }
  // dashed lines
  setLineDash(list) {
    drawingContext.setLineDash(list);
  }

  display(){

    if(this.t.length < 20){
      textSize(32);
    } else {
      textSize(16);
    }
    
    // This node visualized

    // draw the strokes/lines
    this.setLineDash(this.lineList);
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);

    fill(this.c)
    rect(this.x, this.y, this.x_range, this.y_range, this.r);
    console.log("boxxie: ", this.x, this.y, this.x_range, this.y_range, this.r);
    stroke("black"); // reset
    strokeWeight(1); // reset

    fill(color(255 - this.c.levels[0], 255 - this.c.levels[1], 255 - this.c.levels[2]))
    text(this.t, this.x + this.t.length/5, this.y + this.y_range/this.lines -3);
    //Invert colors if clicked or hovered
    if(this.hover || this.active){
      stroke(this.stroke);
      strokeWeight(this.strokeWeight);
      fill(color(255 - this.c.levels[0], 255 - this.c.levels[1], 255 - this.c.levels[2]));
      rect(this.x, this.y, this.x_range, this.y_range, this.r);
      stroke("black");
      strokeWeight(1);
      fill(this.c);
      text(this.t, this.x + this.t.length/5, this.y + this.y_range/this.lines -3);

    }


    fill("color(255, 255, 255)")
    // AND refinement
    if(this.refinement == 1 && this.children.length >= 2){
      var myX = this.x + this.x_range/2;
      var myY = this.y + this.y_range;
      var firstX = this.children[0].x + this.children[0].x_range/2;
      var lastX = this.children[this.children.length - 1].x + this.children[this.children.length - 1].x_range/2
      var childY = this.children[0].y;

      var percentage = .3;
      var startX = myX - (myX - firstX)*percentage
      var startY = myY + (childY - myY)*percentage
      var endX = myX + (lastX - myX)*percentage
      var endY = myY + (childY - myY)*percentage

      // line(startX, startY, endX, endY)
      curve(this.x + this.x_range/2 - this.width/2, this.y, startX,startY, endX, endY, this.x + this.x_range/2 + this.width/2, this.y)
    }

    //Visualize lines to children and then visualize children
    for (let i = 0; i < this.children.length; i++){
      this.setLineDash(this.lineList);
      line(this.x+this.x_range/2, this.y+this.y_range, this.children[i].x+this.children[i].x_range/2,  this.children[i].y)
      this.children[i].display();
    }
  }
}