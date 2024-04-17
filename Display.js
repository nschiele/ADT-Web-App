// class Display {
//     constructor(text, treeID, x = 0, y = 0, radius = 2, dist = 50){
//         this.x = x; // x pos
//         this.x_range; // range of x
//         this.y = y; // y pos
//         this.y_range; // range of y
//         this.t = text; // text node
//         this.r = radius; // rad node
//         this.width; // total width
//         this.height; // total height
//         this.dist = dist; // dist between 2 nodes
//         this.active = false; // node selected?
//         this.hover = false; // hovered over node?
//         this.level = 0;
//         // To add: lines
//         this.c = color(255, 255, 255); // color
//         this.stroke = color("black") // no idea why done like this
//         this.strokeWeight = 2;
//         this.lineList = []; // dashed lines
//         this.lines = 1;
//         this.freeMove = false; // tracks if node is unlocked and can move freely
//         // this.treeID = treeID;
//         this.tree;

//         this.scale_x = 0;
//         this.scale_y = 0;
//         this.scale_x_range = 0;
//         this.scale_y_range = 0;

//         this.adjust_textbox();


//     }

//     adjust_textbox(){
//         console.log("in adjust_textbox");
//         var let_width;
//         var let_height;
//         var text_space;
//         // if(this.t.length < 20){
//         //   textSize(32);
//         //   let_height = 30;
//         //   text_space = this.t.length/2;
//         // } else {
//         //   textSize(16);
//         //   let_height = 20;
//         //   text_space = this.t.length/2;
//         // }
//         ///console.log("Alleen const");
//         // if(this.t.length > 40){
//         //   ///console.log(this.t)
//         //   for(let i = parseInt(this.t.length/2 - 10); i<parseInt(this.t.length/2 + 10); i++){
//         //     // console.log("excusez-moi: ", i, this.t[i])
//         //       //First space in the middle of the text
//         //       if(this.t[i] == ' '){
//         //         var newString = this.t.slice(0, i) + '\n' + this.t.slice(i+1, this.t.length);
//         //         this.t = newString
//         //         break;
//         //       }

//         //     }
//         //   }


//         // if(this.t.includes("\n")){
//         //   var nlSplit = this.t.split("\n");
//         //   var longest = 0;
//         //   for(let i = 0; i < nlSplit.length; i++){
//         //     if(nlSplit[i].length > nlSplit[longest].length){
//         //       longest = i;
//         //     }
//         //     this.lines = nlSplit.length;
//         //     ///console.log(longest, nlSplit)
//         //   }
//         //   this.x_range = textWidth(nlSplit[longest]) + text_space;
//         // } else {
//         //   this.x_range = textWidth(this.t) + text_space;
//         // }
//         this.y_range = let_height * this.lines;
//         this.width = this.x_range;


//         // console.log("this.width: " + this.width);
//         // this.tree.update_width();
//         // this.tree.adjust_children();
//     }

    

//     adjust_text(){
//         ///console.log("text: ", this.t);
//         if(this.t.length > 40){
//             for(let i = parseInt(this.t.length/2 - 10); i<parseInt(this.t.length/2 + 10); i++){
//                 if(this.t[i] == ' '){
//                     var newString = this.t.slice(0, i) + '\n' + this.t.slice(i+1, this.t.length);
//                     this.t.length = newString;
//                 }
//                 break;
//             }
//         }
//     }

//     update_width(treeObject){
//       console.log("*** UPDATE_WIDTH ***");
//       /*
//         console.log("*** UPDATE_WIDTH ***");
//         console.log("NODE LABEL: " + this.t);
//         console.log("NODE WIDTH: " + this.width);
//         console.log("NODE X: " + this.x);
//         console.log("NODE XRANGE: " + this.x_range);
//         console.log("NODE RADIUS: " + this.r);
//       */

//         var child_width = -1*this.dist;
//         for(let i = 0; i < treeObject.children.length; i++){
//             child_width += treeObject.children[i].dis.width + this.dist;
//         }
//         if(child_width > this.x_range){
//             this.width = child_width;
//         }
//         if(treeObject.parent != null){
//             treeObject.parent.update_width();
//         }
//     }

//     checkCoordinates(treeObject, x, y){

//         // Added by C
//         if (this.scale_x == 0)
//           this.scale_x = this.x;

//         if (this.scale_x_range == 0)
//           this.scale_x_range = this.x_range;

//         if (this.scale_y == 0)
//           this.scale_y = this.y;

//         if (this.scale_y_range == 0)
//           this.scale_y_range = this.y_range;

// /*
//           console.log("*** CHECKCOORDINATES ***");
//           console.log("NODE LABEL: " + this.t);
//           console.log("NODE X/XRANGE: " + this.x + "/" + this.x_range);
//           console.log("NODE SCALEX/SCALEXRANGE: " + this.scale_x + "/" + this.scale_x_range);
// */




//         if((x >= this.scale_x) && (x <= (this.scale_x + this.scale_x_range)) && (y >= this.scale_y) && (y <= (this.scale_y + this.scale_y_range))){
//             this.hover = true;
//             treeObject.hover = true; // Solves the issue! By J.
//             // console.log("hoovah: ", this);
//             return this;
//         } else {
//             this.hover = false;
//             treeObject.hover = false;
//             for(let i = 0; i < treeObject.children.length; i++){
//                 var toReturn = treeObject.children[i].dis.checkCoordinates(this.tree, x, y);
//                 if(toReturn != null){
//                     return toReturn;
//                 }
//             }
//             // return null;
//         }
//     }

//     clearActive(treeObject){
//         this.active = false;
//         for(let i = 0; i < treeObject.children.length; i++){
//             treeObject.children[i].clearActive();
//         }
//     }

//     getActive(treeObject){
//         if (treeObject.dis.active === true) {
//             return this;
//         }
//         if (treeObject.children && treeObject.children.length > 0) {
//             for (let i = 0; i < treeObject.children.length; i++) {
//                 const result = this.getActive(treeObject.children[i]);
//                 if (result) {
//                     return result;
//                 }
//             }
//         }
//         return null;
//     }

//     compareNames(label, treeObject){
//         if (treeObject.label === label) {
//             return treeObject;
//         }
//         if (treeObject.children && treeObject.children.length > 0) {
//             for (let i = 0; i < treeObject.children.length; i++) {
//                 const result = this.compareNames(label, treeObject.children[i]);
//                 if (result) {
//                     return result;
//                 }
//             }
//         }
//         return null;
//     }

//     adjust_children(treeObject){
//       console.log("IN ADJUST_CHILDREN");
//         var curr_x = this.x + this.x_range/2 - this.width/2;
//         // console.log(this.child_width(dist))
//         for(let i = 0; i < treeObject.children.length; i++){
//             //Handling Child X Location
//             treeObject.children[i].dis.x = curr_x;
//             // if(treeObject.children[i].children.length == 0){
//                 treeObject.children[i].dis.x += treeObject.children[i].dis.width/2;
//                 treeObject.children[i].dis.x -= treeObject.children[i].dis.x_range/2;
//             // }

//             curr_x += treeObject.children[i].dis.width + this.dist;
//             //Handling Child Y Location
//             treeObject.children[i].dis.y = this.y + 100;
//             treeObject.children[i].dis.level = this.level + 1;

//         }
//         for(let i = 0; i < treeObject.children.length; i++){
//             treeObject.children[i].adjust_children();
//         }
//     }

//     resetLines() {
//         stroke("black");
//         strokeWeight(1);
//     }

//       // dashed lines
//     setLineDash(list) {
//         drawingContext.setLineDash(list);
//     }

//     display(treeObject){
//       console.log("IN DISPLAY");
//       var amountOfNodesInLine = treeObject.children.length; // For AND REFINEMENT
//         if(this.t.length < 20){
//             textSize(32);
//         } else {
//             textSize(16);
//         }
//         // This node visualized

//         // draw the strokes/lines
//         // reset to []; normal line (C)
//         this.setLineDash(this.lineList);
//         stroke(this.stroke);
//         strokeWeight(this.strokeWeight);
//         fill(this.c)
//         // console.log("*** DISPLAY ***");
//         // console.log(this.t + "\n" + this.x + "/" + this.y + "\n" + this.scale_x + "/" + this.scale_y + "\n\n");
//         rect(this.x, this.y, this.x_range, this.y_range, this.r);
//         stroke("black"); // reset
//         strokeWeight(1); // reset
//         fill(color(255 - this.c.levels[0], 255 - this.c.levels[1], 255 - this.c.levels[2]))
//         text(this.t, this.x + this.t.length/5, this.y + this.y_range/this.lines -3);
//         //Invert colors if clicked or hovered
//         console.log("is active?: ", this.active);
//         if(this.active){
//             stroke(this.stroke);
//             strokeWeight(this.strokeWeight);
//             fill(color(255 - this.c.levels[0], 255 - this.c.levels[1], 255 - this.c.levels[2]));
//             rect(this.x, this.y, this.x_range, this.y_range, this.r);
//             stroke("black");
//             strokeWeight(1);
//             fill(this.c);
//             text(this.t, this.x + this.t.length/5, this.y + this.y_range/this.lines -3);
//             this.active = true;
//         }

//         fill("color(255, 255, 255)")
//         // AND refinement
//         if(treeObject.refinement == 1 && treeObject.children.length >= 2){
//             var myX = this.x + this.x_range/2;
//             var myY = this.y + this.y_range;
//             var firstX = treeObject.children[0].dis.x + treeObject.children[0].dis.x_range/2;
//             var lastX = treeObject.children[treeObject.children.length - 1].dis.x + treeObject.children[treeObject.children.length - 1].dis.x_range/2;

//             // if final child is a different node type (attack->defense or defense->attack), don't include it in AND line
//             if (treeObject.type != treeObject.children[treeObject.children.length - 1].type){
//               amountOfNodesInLine -= 1;
//               lastX = treeObject.children[treeObject.children.length - 2].dis.x + treeObject.children[treeObject.children.length - 2].dis.x_range/2;
//             }

//             var childY = treeObject.children[0].dis.y;

//             var percentage = .3;
//             var startX = myX - (myX - firstX)*percentage
//             var startY = myY + (childY - myY)*percentage
//             var endX = myX + (lastX - myX)*percentage
//             var endY = myY + (childY - myY)*percentage

//             if (amountOfNodesInLine == 2){
//               line(startX, startY, endX, endY);
//             }

//             else {
//               curve(this.x + this.x_range/2 - this.width/2, this.y, startX,startY, endX, endY, this.x + this.x_range/2 + this.width/2, this.y)
//             }
//         }
//         // If red (attack) and change manually to green (defense), also changes type in ADTree object (and vice versa)
//         if ((this.stroke.levels[0] === 255) && this.tree.type === 1) {
//             this.tree.type = 0;
//         } else if ((this.stroke.levels[1] === 128) && this.tree.type === 0) {
//             this.tree.type = 1;
//         }


//         //Visualize lines to children and then visualize children
//         for (let i = 0; i < treeObject.children.length; i++){
//             this.setLineDash(this.lineList);

//             // Check if line should be dotted (C)
//             if (treeObject.type != treeObject.children[i].type)
//               this.setLineDash([10, 5]);

//             line(this.x+this.x_range/2, this.y+this.y_range, treeObject.children[i].dis.x+treeObject.children[i].dis.x_range/2,  treeObject.children[i].dis.y)
//             treeObject.children[i].display();
//         }
//     }



// }
