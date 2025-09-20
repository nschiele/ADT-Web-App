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

    


// Why is this file still here? Can't we remove it by now?                                                                                                                                                                  
                                                                   
