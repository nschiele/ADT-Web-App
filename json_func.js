// Node datastructure
class Node {
    constructor() {
        this.label = null;
        this.refinement = null;
        this.code = null;
        this.depth = null;
        this.swith_role = null;
        this.parent = null;
        this.parameters = {};
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
async function insert(root, label, refinement, swith_role, parameters, depth, lastNode, seen){ // assign code to nodes without building tree example: 0-0-1
    // console.log("insert");
    // console.log(parameters[0].parameter_name);
    // console.log(parameters[0].parameter_value);
    var order = null;
    var node = new Node();
    node.label = label;
    node.refinement = refinement;
    node.depth = depth;
    node.swith_role = swith_role;
    node.parameters = parameters; 

    // 4e kind ipv 0e todo opgelost?

    if (root == null){
        node.code = "0";
        node.parent = node;
    }
    else{
        if (lastNode.depth < depth){
            node.code = lastNode.code + "-0";
            node.parent = lastNode;
        }
        else if (lastNode.depth > depth){
            var i = seen.length-1;
            var j = null;
            order = 0;
            while (seen[i] != null){
                if (seen[i].depth == depth){
                    if (j == null){
                        order++;
                        j = i;
                        node.parent = seen[i].parent;
                    }
                    else if (node.parent == seen[i].parent){
                        order++;
                    }
                }
                i--;
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
            node.parent = lastNode.parent;
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
        return ref_swi;
    }
    else{
        while (item[j] != "="){ // Find switchRole
            j++;
            if (item[j] == ">"){
                ref_swi = 0;
                return ref_swi;
            }
        }
        j += 2;
        if (item[j] == "y"){
           ref_swi = 1;
        }
        else{
            ref_swi = 0;
        }
    }
    return ref_swi;
}

async function find_par(items, i){ // todo category
    var j = 0;
    var parameters = [];
    var parameter = new Array(2).fill(0);
    var parameter_name = null;
    var parameter_value = null;
    var item = items[i];

    while (item[j] != "<"){ // kan crashen
        j++;
    }
    while (item[j+1] == "p"){
        parameter_name = "";
        parameter_value = "";
        // Retrieve the name
        while (item[j] != "="){ // Find the refinement
            j++;
        }
        j += 2;
        while (item[j] != '"'){
            parameter_name += item[j];
            j++
        }
        while (item[j] != ">"){
            j++;
        }
        j++;
        while (item[j] != '<'){
            parameter_value += item[j];
            j++
        }

        parameter[0] = parameter_name;
        parameter[1] = parameter_value;
        parameters.push(parameter);

        j = 0;
        i++;
        item = items[i];
        while (item[j] != "<"){ // kan crashen
            j++;
        }
        parameter.delete;
        parameter = new Array(2).fill(0);
    }
    parameter.delete;
    return parameters;
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
        switch (item[j + 1]){ // Every tag has to be treated differently
            case "/": // Closing tag
                depth--;
                break;
            case "a": // Adtree tag
                break;
            case "n": // Node tag
                // todo hardcoden van variable locaties wegwerken
                label = await find_label(items[i+1]);
                refinement = await find_ref_rol(item, j, r);
                r = 1;
                swith_role = await find_ref_rol(item, j, r);
                r = 0;
                parameters = await find_par(items, i+2);
                if (root == null){
                    root = await insert(root, label, refinement, swith_role, parameters, depth, null, seen);
                    lastNode = root;
                    seen[0] = root;
                }
                else{
                    depth++;
                    var k = 0;
                    while (seen[k] != null){
                        k++
                    }
                    lastNode = await insert(root, label, refinement, swith_role, parameters, depth, lastNode, seen);
                    seen[k] = lastNode;
                }
                break;
            case "l":
                break; // Label tag, skip
            case "p": 
                break; // Parameter tag, skip
            default: // Do nothing
        }
    }
    seen.forEach(item => {
        to_json(item, json);
      });
    console.log(json);
    return json;
}

function add_child(node, temp_string){
    console.log(node);
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

    if (node.parameters.length != 0){
        for (var i = 0; i < node.parameters.length; i++){
            temp_string += '<parameter domainId="';
            temp_string += node.parameters[i][0];
            temp_string += '">';
            temp_string += node.parameters[i][1];
            temp_string += '</parameter>';
        }
    }

    for (var i = 0; i < Object.keys(node).length-7; i++){ // keys komen niet overeen met volgorde
        temp_string = add_child(node[i], temp_string);
    }

    temp_string += '</node>';

    return temp_string;
}

function build_xml(input_text){
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
        input_text = input;
        var xml = build_xml(input_text); // Get JSON string and parse to JSON object
        return xml;
    }
}
