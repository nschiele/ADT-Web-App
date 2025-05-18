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
async function getXML(input){
    // let url = "https://raw.githubusercontent.com/nschiele/ADT-Web-App/main/xml%20examples/fig13.xml";
    // let resp = await fetch(url);
    var check = "";
    if (typeof input === "string"){
      check = input.substring(0,5);
    }


    if (check == "<?xml"){
      return input;
    }

    let xml = await input.text();
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
async function insert(root, label, refinement, swith_role, parameters, depth, lastNode, seen,  edgeLabel = null){ // assign code to nodes without building tree example: 0-0-1
    var order = null;
    var node = new Node();
    node.label = label;
    node.refinement = refinement;
    node.depth = depth;
    node.swith_role = swith_role;
    node.parameters = parameters;

    if (edgeLabel !== null) {
        node.edgeLabel = edgeLabel;
    }

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

function find_label(items, i) {
    for (let k = i; k < items.length; k++) {
        const match = items[k].match(/<label>(.*?)<\/label>/);
        if (match) {
            return match[1];
        }
    }
    throw new Error("Label not found after node at line " + i);
}


// async function find_label(items, i){
//     console.log(items);
//     var label = "";
//     var j = 0;
//     var k = i;
//     var item = items[k];
//     while (item[j] != "l"){
//         if (item[j] == ">"){
//             k++;
//             item = items[k];
//             j = 0;
//         }
//         else{
//             j++;
//             if (item[j] == "l" && item[j+1] == "e"){
//                 j++;
//             }
//         }
//     }
//     // Retrieve the label
//     while (item[j] != ">"){
//         j++;
//     }
//     j++;
//     while (item[j] != '<'){
//         console.log(item[j]);
//         label += item[j];
//         j++
//     }
//     return label;
// }

// hc pos todo
async function find_ref_rol(item, j, r){
    var ref_swi;
    while (item[j] != '"'){ // Find the refinement
        j++;
    }
    j++;
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
        while (item[j] != '"'){
            j++;
        }
        j++;
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
    var start = i;
    var parameters = {};
    var parameter_name = null;
    var parameter_value = null;
    var item = items[i];


    while (item[j] != "<"){ // kan crashen
        j++;
        if (item[j] == "p"){
            break;
        }
        else if (item[j] == "/" || (item[j] == "n" && i != start)){
            return parameters;
        }
        else{
            i++;
            j = 0;
            item = items[i];
        }
    }
    while (item[j] == "p"){
        parameter_name = "";
        parameter_value = "";
        // Retrieve the name
        while (item[j] != '"'){
            j++;
        }
        j++;
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

        parameters[parameter_name] = parameter_value;

        j = 0;
        i++;
        item = items[i];
        while (item[j] != "<"){ // kan crashen
            j++;
        }
        j++;
    }
    return parameters;
}

// Add parameters as elements of the json
// Builds the json object as a string
async function build_json(input_text){

    // wanneer var en wanneer const (variabelen)
    const items = input_text.split("\n"); // Put the XML lines into a list of strings

    if (items[items.length - 1] == "")
      items.pop();

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
            case "a":
                break; // Adtree tag, skip
            case "n": // Node tag
                // todo hardcoden van variable locaties wegwerken
                // label = await find_label(items, i);
                let label = find_label(items, i);
                refinement = await find_ref_rol(item, j, r);
                r = 1;
                swith_role = await find_ref_rol(item, j, r);
                r = 0;
                parameters = await find_par(items, i);

                const edgeLabelMatch = item.match(/edgeLabel="(.*?)"/);
                const edgeLabel = edgeLabelMatch ? edgeLabelMatch[1] : null;
                
                if (root == null){
                    root = await insert(root, label, refinement, swith_role, parameters, depth, null, seen, edgeLabel);

                    if (edgeLabel) {
                        root.edgeLabel = edgeLabel;
                    }
                    
                    lastNode = root;
                    seen[0] = root;
                }
                else{
                    depth++;
                    var k = 0;
                    while (seen[k] != null){
                        k++
                    }

                    lastNode = await insert(root, label, refinement, swith_role, parameters, depth, lastNode, seen, edgeLabel);
                    if (edgeLabel) {
                        lastNode.edgeLabel = edgeLabel;
                    }
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
    return json;
}


function add_child(node, temp_string, download){
    temp_string += '\n';
    temp_string += "  ";
    for (var i = 0; i < node.depth; i++){
        temp_string += "    ";
    }
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
    temp_string += '\n';

    for (var i = 0; i < node.depth+1; i++){
        temp_string += "    ";
    }
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

    if (!download) {
        for (var i = 0; i < Object.keys(node).length-7; i++){ // keys komen niet overeen met volgorde
            temp_string = add_child(node[i], temp_string, 0);
        }

        temp_string += '</node>';
        // temp_string += '\n';
        // temp_string += node.depth*" ";
    }

    return temp_string;
}

function build_xml(input_text){
    var parser = new DOMParser();
    var temp_string = '<?xml version="1.0" encoding="UTF-8"?><adtree>';
    var xml = null;

    temp_string = add_child(input_text[0], temp_string, 0);

    temp_string += '</adtree>';
    xml = parser.parseFromString(temp_string, "text/xml");
    return xml;
}

//Converts XML to JSON and JSON to XML
async function convert(XorJ, input){
    var input_text;

    if (XorJ == 0){ // XorJ == 0 gives that input_file contains a XML
        input_text = await getXML(input); // Get XML string
        var json = await build_json(input_text); // Get JSON string and parse to JSON object
        return json;
    } else{ // else gives that input_file contains a JSON
        input_text = input;
        var xml = build_xml(input_text); // Get JSON string and parse to JSON object
        return xml;
    }
}


function testExternalJS(){
  console.log("[*] In testExternalJS(): EXTERNAL JAVASCRIPT WORKING");
}
