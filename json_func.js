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

// Builds the json object as a string
async function build_json(input_text){
    const items = input_text.split("\n"); // Put the XML lines into a list of strings
    var json = "{"; // String where in the json object will be build
    var item; // Single line of the XML file
    var temp = ""; // Temporary variable to save label names
    var j, k; // Counting variables
    var depth = 0; // Keeping track of the depth of the json
    var last = 0; // Did we close the last node? 0 means yes, 1 means no
    for (var i = 1; i < items.length; i++){ // Loop through all lines
        item = items[i];
        j = 0;
        while (item[j] != "<"){ // Find the first useful character
            j++
        }
        switch(item[j + 1]){ // Every tag has to be treated differently
            case "/": // Closing tag
                depth--;
                if (item[j + 2] == "n"){ // Node closing tag? (nodes and parameters use [ & ] and need a different closing tag in json)
                    json += '}]';
                    last = 0;
                }
                else{
                    json += '}';
                }
                break;
            case "a": // Adtree tag
                depth++;
                json += '"adtree": {';
                break;
            case "n": // Node tag
                depth++;
                if (depth > 2){
                    json += ", ";
                }
                if (last == 0){
                    json += '"node": [ {';
                    last = 1;
                }
                else{
                    json += '{'
                }
                json += await ref_swi(item, j); // Add refinement and switchroles
                break;
            case "l": // Label tag
                temp = "";
                k = j + 7; // Position of label
                while (item[k] != "<"){ // Retrieve the label
                    temp += item[k];
                    k++;
                }
                json += '"label": ' + '"' + temp + '"';
                break;
            case "p": // Parameter tag
                break;
            default: // Do nothing
        }
    }
    json += "}"
    console.log(json);
    return json;
}

// Add refinement and switchroles
async function ref_swi(item, j){
    var temp;
    while (item[j] != "r"){ // Find the refinement
        j++;
    }
    j += 12; // Position of refinement
    if (item[j] == "c"){
        temp = '"refinement": "conjunctive",'
    }
    else{
        temp = '"refinement": "disjunctive",'
    }
    j += 13 // Position of switchRole
    if (item[j] == "s"){
        temp += '"switchRole": "yes",';
    }
    return temp;
}

//Converts XML to JSON and JSON to XML
async function convert(XorJ){
    var input_text
    if (XorJ == 0){ // XorJ == 0 gives that input_file contains a XML
        /*
        input_text = [ // Declare XML as list of strings
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<adtree>',
            '    <node refinement="conjunctive">',
            '        <label>Bank Account</label>',
            '        <node refinement="disjunctive">',
            '            <label>learn PIN</label>',
            '            <node refinement="disjunctive">',
            '                <label>eavesdrop PIN</label>',
            '                <parameter domainId="MinTimeSeq1">10.0</parameter>',
            '                <parameter domainId="ProbSucc2">0.5</parameter>',
            '            </node>',
            '            <node refinement="disjunctive">',
            '                <label>find PIN</label>',
            '                <parameter domainId="MinTimeSeq1">100.0</parameter>',
            '                <parameter domainId="ProbSucc2">0.1</parameter>',
            '            </node>',
            '            <node refinement="conjunctive" switchRole="yes">',
            '                <label>security training</label>',
            '                <node refinement="disjunctive">',
            '                    <label>learn rules</label>',
            '                    <parameter domainId="ProbSucc2">0.7</parameter>',
            '                </node>',
            '                <node refinement="disjunctive">',
            '                    <label>adhere to rules</label>',
            '                    <parameter domainId="ProbSucc2">0.3</parameter>',
            '                    <node refinement="disjunctive" switchRole="yes">',
            '                        <label>threaten victim</label>',
            '                        <parameter domainId="MinTimeSeq1">5.0</parameter>',
            '                        <parameter domainId="ProbSucc2">0.9</parameter>',
            '                    </node>',
            '                </node>',
            '            </node>',
            '        </node>',
            '        <node refinement="disjunctive">',
            '            <label>get card</label>',
            '            <parameter domainId="MinTimeSeq1">20.0</parameter>',
            '            <parameter domainId="ProbSucc2">0.25</parameter>',
            '        </node>',
            '    </node>',
            '    <domain id="MinTimeSeq1">',
            '        <class>lu.uni.adtool.domains.predefined.MinTimeSeq</class>',
            '        <tool>ADTool</tool>',
            '    </domain>',
            '    <domain id="ProbSucc2">',
            '        <class>lu.uni.adtool.domains.predefined.ProbSucc</class>',
            '        <tool>ADTool</tool>',
            '    </domain>',
            '</adtree>',
        ]*/
        input_text = await getXML(); // Get XML string
        var json = JSON.parse(await build_json(input_text)); // Get JSON string and parse to JSON object
        return json;
    }
    //else{ // else gives that input_file contains a JSON

    //}
}