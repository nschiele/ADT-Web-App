class Node {
    constructor() {
        this.key = 0;
        this.label = null;
        this.refinement = null;
        this.code = null;
       this.depth = null;
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

async function to_json(seen){
    var json = {
        "adtree": {
            "node": {
            }
        }
    }
    var i = 0;
    var depth = 0;
    var lastNode = 0;
    for (var i = 0; i < seen.length; i++){
        if (seen[i].code == "0"){
            lastNode = seen[i].code;
            json.adtree.node["label"] = seen[i].label;
            json.adtree.node["refinement"] = seen[i].refinement;
            json.adtree.node["node"] = [];
        }
        // else{

        // }
    }
   return json;
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
async function insert(root, key, label, refinement, depth, lastNode, seen){ // assign code to nodes without building tree example: 0-0-1
    var order = null;
    var node = new Node();
    node.key = key;
    node.label = label;
    node.refinement = refinement;
    node.depth = depth;

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
    return refinement;
}

// Builds the json object as a string
async function build_json(input_text){
    // wanneer var en wanneer const (variabelen)
    const items = input_text.split("\n"); // Put the XML lines into a list of strings
    var item; // Single line of the XML file
    var j, k; // Counting variables
    var depth = 0; // Keeping track of the depth of the json
    var root = null; // Root of ADT init
    var key = 0;
    var seen = []; // erase array after going back in depth
    var lastNode = null;
    var json = {};

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
                label = await find_label(items[i+1], j);
                refinement = await find_refinement(item, j);
                if (root == null){
                    root = await insert(root, key, label, refinement, depth, null, seen);
                    lastNode = root;
                    seen[0] = root;
                    console.log(lastNode);
                }
                else{
                    depth++;
                    var k = 0;
                    while (seen[k] != null){
                        k++
                    }
                    lastNode = await insert(root, key, label, refinement, depth, lastNode, seen);
                    seen[k] = lastNode;
                    console.log(lastNode);
                }
                break;
            case "l":
                break; // Label tag
            case "p": // Parameter tag
                break;
            default: // Do nothing
        }
    }
    json = await to_json(seen);
    console.log(json);
    return json;
}

//Converts XML to JSON and JSON to XML
async function convert(XorJ){
    var input_text
    if (XorJ == 0){ // XorJ == 0 gives that input_file contains a XML
        input_text = await getXML(); // Get XML string
        var json = await build_json(input_text); // Get JSON string and parse to JSON object
        return json;
    }
    //else{ // else gives that input_file contains a JSON

    //}
}
