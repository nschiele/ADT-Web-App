// Node datastructure
class Node {
    constructor() {
        this.label = null;
        this.refinement = null;
        this.code = null;
        this.depth = null;
        this.swith_role = null;
    }
}

// Function for returning JSON
function getJson(temp, input) { 
    return convert(temp, input);
}

// Open the XML testfile
async function getXML(){
    let url = "https://raw.githubusercontent.com/nschiele/ADT-Web-App/main/xml%20examples/fig13.xml";
    let resp = await fetch(url);
    let xml = await resp.text();
    return xml;
}

async function to_json(item, adtree){
    let codes = item.code.split('-');
    let parent = adtree;
  
    for (let i = 0; i < codes.length; i++) {
      let code = codes[i];
  
      if (!parent.hasOwnProperty(code)) {
        parent[code] = {};
      }
      
      parent = parent[code];
    }
  
    Object.assign(parent, item);
}

// test codes in order:
// 0
// 0-0
// 0-0-0
// 0-0-1
// 0-0-2
// 0-0-2-0
// 0-0-2-1
// 0-0-2-1-0
// 0-1
async function insert(root, label, refinement, swith_role, depth, lastNode, seen){ // assign code to nodes without building tree example: 0-0-1
    var order = null;
    var node = new Node();
    node.label = label;
    node.refinement = refinement;
    node.depth = depth;
    node.swith_role = swith_role;

    if (root == null){
        node.code = "0";
    }
    else{
        if (lastNode.depth < depth){
            node.code = lastNode.code + "-0";
        }
        else if (lastNode.depth > depth){
            var i = 0;
            var j = null;
            order = 0;
            while (seen[i] != null){
                if (seen[i].depth == depth){
                    order++;
                    j = i;
                }
                i++;
                
            }
            if (j !=null){
                node.code = seen[j].code.substr(0, seen[j].code.length - 1) + '' + order;
            }
            else{
                node.code = lastNode.code + "-0";
            }
        }
        else{
            order = Number(lastNode.code[lastNode.code.length - 1]) + 1;
            node.code = lastNode.code.substr(0, lastNode.code.length - 1) + '' + order;
        }
    }
    return node;
}

// Don't hardcode positions
async function find_label(item){
    var label = "";
    var j = 0;
    // Retrieve the label
    while (item[j] != ">"){
        j++;
    }
    j++;
    while (item[j] != '<'){
        label += item[j];
        j++
    }
    return label;
}

async function find_ref_rol(item, j, r){
    var ref_swi;
    while (item[j] != "="){ // Find the refinement
        j++;
    }
    j += 2;
    if (r == 0){
        if (item[j] == "c"){
            ref_swi = 1;
        }
        else{
            ref_swi = 0;
        }
    }
    else{
        j += 13 // Position of switchRole
        if (item[j] == "s"){
           ref_swi = 1;
        }
        else{
            ref_swi = 0;

        }
    }
    return ref_swi;
}

// Add parameters as elements of the json
// Builds the json object as a string
async function build_json(input_text){
    // wanneer var en wanneer const (variabelen)
    const items = input_text.split("\n"); // Put the XML lines into a list of strings
    var item; // Single line of the XML file
    var j, k; // Counting variables
    var depth = 0; // Keeping track of the depth of the json
    var root = null; // Root of ADT init
    var seen = []; // erase array after going back in depth
    var lastNode = null;
    var json = {};
    var r = 0; // find refinement or if role is switched

    for (var i = 1; i < items.length; i++){ // Loop through all lines
        item = items[i];
        j = 0;
        while (item[j] != "<"){ // Find the first useful character
            j++
        }
        switch(item[j + 1]){ // Every tag has to be treated differently
            case "/": // Closing tag
                depth--;
                break;
            case "a": // Adtree tag
                break;
            case "n": // Node tag
                label = await find_label(items[i+1]);
                refinement = await find_ref_rol(item, j, r);
                r = 1;
                swith_role = await find_ref_rol(item, j, r);
                r = 0;
                if (root == null){
                    root = await insert(root, label, refinement, swith_role, depth, null, seen);
                    lastNode = root;
                    seen[0] = root;
                }
                else{
                    depth++;
                    var k = 0;
                    while (seen[k] != null){
                        k++
                    }
                    lastNode = await insert(root, label, refinement, swith_role, depth, lastNode, seen);
                    seen[k] = lastNode;
                }
                break;
            case "l":
                break; // Label tag
            case "p": // Parameter tag
                break;
            default: // Do nothing
        }
    }
    seen.forEach(item => {
        to_json(item, json);
      });
    return json;
}

function add_child(node, temp_string){
    temp_string += '<node refinement=';
    if (node.refinement == 0){
        temp_string += '"disjunctive"';
    }
    else{
        temp_string += '"conjunctive"';
    }

    if (node.swith_role == 1){
        temp_string += ' switchRole="yes"';
    }
    temp_string += '>';

    temp_string += '<label>';
    temp_string += node.label;
    temp_string += '</label>';

    for (var i = 0; i < Object.keys(node).length-5; i++){
        temp_string = add_child(node[i], temp_string);
    }

    temp_string += '</node>';

    return temp_string;
}

function build_xml(input_text){
    console.log(Object.keys(input_text[0]).length);
    console.log(input_text);
    var parser = new DOMParser();
    var temp_string = '<?xml version="1.0" encoding="UTF-8"?><adtree>';
    var xml = null;

    temp_string = add_child(input_text[0], temp_string);
    
    temp_string += '</adtree>';
    console.log(temp_string);
    xml = parser.parseFromString(temp_string, "text/xml");
    return xml;
}

//Converts XML to JSON and JSON to XML
async function convert(XorJ, input){
    var input_text
    if (XorJ == 0){ // XorJ == 0 gives that input_file contains a XML
        input_text = await getXML(); // Get XML string
        var json = await build_json(input_text); // Get JSON string and parse to JSON object
        return json;
    }
    else{ // else gives that input_file contains a JSON
        input_text = input;//JSON.stringify(input);
        var xml = build_xml(input_text); // Get JSON string and parse to JSON object
        return xml;
    }
}
