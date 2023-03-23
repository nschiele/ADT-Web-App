class Node {
    constructor() {
        this.key = 0;
        this.label = null;
        this.refinement = null;
        this.parent = null;
        this.children = [];
        this.amount = 0;
    }
}

// Function for returning JSON
function getJson(temp) { 
    if (temp == 0){
        var example = {
            "adtree": {
                "node": {
                    "label": "Free Lunch",
                    "node": [
                        {
                            "label": "Get Legit Customer to buy lunch for you",
                            "node": [
                                {
                                    "label": "Promise to Pay back later",
                                    "_refinement": 0
                                },
                                {
                                    "label": "Man in the middle attack",
                                    "node": [
                                        {
                                            "label": "Tell customer you will pick up their bill"
                                        },
                                        {
                                            "label": "Go to counter tell waiter legit customer will pay for you"
                                        },
                                        {
                                            "label": "Wave at customer (will wave back in agreement)"
                                        }
                                    ],
                                    "_refinement": 1
                                }
                            ],
                            "_refinement": 0
                        },
                        {
                            "label": "Eat and run",
                            "node": [
                                {
                                    "label": "Order meal and ask for bill"
                                },
                                {
                                    "label": "Leave restaurant",
                                    "node": [
                                        {
                                            "label": "Sneak out through bathroom window"
                                        },
                                        {
                                            "label": "Just run..."
                                        }
                                    ],
                                    "_refinement": 0
                                }
                            ],
                            "_refinement": 1
                        },
                        {
                            "label": "Pretend to work at restaurant",
                            "node": [
                                {
                                    "label": "Ask chef to prepare meal for table n"
                                },
                                {
                                    "label": "Salami attack",
                                    "node": [
                                        {
                                            "label": "Wait on customers"
                                        },
                                        {
                                            "label": "Collect a little bit of food from each customer's plate"
                                        },
                                        {
                                            "label": "Find place to eat"
                                        }
                                    ],
                                    "_refinement": 1
                                }
                            ],
                            "_refinement": 0
                        }
                    ],            
                    "_refinement": 0
                }
            }
        }
        return example;
    }
    else if(temp == 1){
        return convert(0);
    }
    else{
        
        return convert(1);
    }
}

// Open the XML testfile
async function getXML(){
    let url = "https://raw.githubusercontent.com/nschiele/ADT-Web-App/main/xml%20examples/fig13.xml";
    let resp = await fetch(url);
    let xml = await resp.text();
    return xml;
}

// function parse_node(node) {
//     var json_node = {};

//     // Parse the label for the current node
//     var label = node.getElementsByTagName("label")[0];
//     json_node.label = label.textContent;

//     // Parse the refinement for the current node
//     var refinement = node.getAttribute("refinement");
//     if (refinement) {
//         json_node.refinement = refinement;
//     }

//     // Parse any parameters for the current node
//     var parameters = node.getElementsByTagName("parameter");
//     if (parameters.length > 0) {
//         json_node.parameters = {};
//         for (var i = 0; i < parameters.length; i++) {
//             var parameter = parameters[i];
//             var domainId = parameter.getAttribute("domainId");
//             var value = parameter.textContent;
//             json_node.parameters[domainId] = value;
//         }
//     }

//     // Recursively parse child nodes
//     var child_nodes = node.getElementsByTagName("node");
//     if (child_nodes.length > 0) {
//         json_node.children = [];
//         for (var i = 0; i < child_nodes.length; i++) {
//             var child_node = child_nodes[i];
//             json_node.children.push(parse_node(child_node));
//         }
//     }

//     return json_node;
// }

// // Builds the json object as a string
// async function build_json(input_text) {
//     var parser = new DOMParser();
//     var xml = parser.parseFromString(input_text, "text/xml");

//     // Parse the root node of the adtree
//     var adtree_node = new Node(xml.getElementsByTagName("adtree")[0]);
//     var json = parse_node(adtree_node);

//     console.log(JSON.stringify(json, null, 2));
//     return json;
// }

// // Add refinement and switchroles
// async function ref_swi(item, j){
//     var temp;
//     while (item[j] != "r"){ // Find the refinement
//         j++;
//     }
//     j += 12; // Position of refinement
//     if (item[j] == "c"){
//         temp = '"refinement": "conjunctive",'
//     }
//     else{
//         temp = '"refinement": "disjunctive",'
//     }
//     j += 13 // Position of switchRole
//     if (item[j] == "s"){
//         temp += '"switchRole": "yes",';
//     }
//     return temp;
// }

// function printInorder(node) {
//     if (node == null)
//         return;

//     /* first recur on left child */
//     printInorder(node.node_left);

//     /* then print the data of node */
//     document.write(node.node_name + " ");

//     /* now recur on right child */
//     printInorder(node.node_right);
// }

// // Builds temporary datastructure
// async function temp_dstr(xml){
//     var root = null;

//     var root = xml.getElementsByTagName("adtree")[0];

//     return tree_in_list;

//     root = new Node(1);
//     root.node_left = new Node(2);
//     root.node_right = new Node(3);
//     root.node_left.node_left = new Node(4);
//     root.node_left.node_right = new Node(5);
//     document.write("<br/>Inorder traversal of binary tree is <br/>");
//     printInorder(root);
// }

async function add_Node(key, label, refinement){
    var node = new Node();
    node.key = key;
    node.label = label;
    node.refinement = refinement;

    return node;
}

async function insert(root, key, label, refinement, depth, last_node){
    var child = add_Node(key, label, refinement);
    var x = root;
    var y = null;

    while (x != null){
        y = x;
        if (key % depth*2 == 0)
            x = x.children[];
        else
            x = x.left;
    }

    // root = null tree is empty
    // new node is root node
    if (y == null)
        y = child; 
    // If new key is less than leaf node key
    // Assign new node as its left child
    else if (key % 2 == 0){
        y.right = child;
    }
    // else assign new node as its  right child
    else{
        y.left = child;
    }

    return y;
}

async function find_label(item, j){
    label = "";
    j = j + 11;
    while (item[j] != "<"){ // Retrieve the label
        label += item[j];
        j++;
    }
    return label;
}

async function find_refinement(item, j){
    var refinement;
    while (item[j] != "r"){ // Find the refinement
        j++;
    }
    j += 12; // Position of refinement
    if (item[j] == "c"){
        refinement = "conjunctive";
    }
    else{
        refinement = "disjunctive"
    }
    // j += 13 // Position of switchRole
    // if (item[j] == "s"){
    //     temp += '"switchRole": "yes",';
    // }
    return refinement;
}

function Inorder(root)
{
    if (root == null)
        return;
    else
    {
        Inorder(root.left);
        console.log(root.key +" ");
        Inorder(root.right);
    }
}

// Builds the json object as a string
async function build_json(input_text){
    const items = input_text.split("\n"); // Put the XML lines into a list of strings
    var item; // Single line of the XML file
    var temp = ""; // Temporary variable to save label names
    var j, k; // Counting variables
    var depth = 0; // Keeping track of the depth of the json
    var last = 0; // Did we close the last node? 0 means yes, 1 means no
    var root = null; // Root of ADT init
    var key = 0;
    var seen = [];
    var last_node = null;

    for (var i = 1; i < items.length; i++){ // Loop through all lines
        item = items[i];
        console.log(depth);
        console.log(item);
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
                depth++;
                k = 1
                while (seen[depth*k] != null){
                    k++
                }
                seen[depth*k] = 1;
                key = depth*k;
                label = find_label(items[i+1], j);
                refinement = find_refinement(item, j);
                if (root == null){
                    root = insert(root, key, label, refinement, depth, null);
                    //console.log(root);
                }
                else
                    last_node = insert(root, key, label, refinement, depth, last_node);
                break;
            case "p": // Parameter tag
                break;
            default: // Do nothing
        }
    }
    console.log(root);
    return root;
}

//Converts XML to JSON and JSON to XML
async function convert(XorJ){
    var input_text
    if (XorJ == 0){ // XorJ == 0 gives that input_file contains a XML
        input_text = await getXML(); // Get XML string
        var json = JSON.parse(await build_json(input_text)); // Get JSON string and parse to JSON object
        return json;
    }
    //else{ // else gives that input_file contains a JSON

    //}
}
