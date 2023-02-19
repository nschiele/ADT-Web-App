
function getJson(temp) { //Function for returning JSON
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
        convert(0);
    }
    else{
        
        convert(1);
    }
}

/*async function getXML(){
    let url = "https://raw.githubusercontent.com/nschiele/ADT-Web-App/main/xml%20examples/fig13.xml";
    let resp = await fetch(url);
    let xml = await resp.text();
    return xml;
}*/

async function convert(XorJ){
    var input_text
    if (XorJ == 0){ // XorJ == 0 gives that input_file contains a XML
        //input_text = await getXML();
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
        ]
        var json = {
            "adtree":{

            }
        };
        var item
        for (var i = 1; i < input_text.length; i++){
            item = input_text[i];
            for (var j = 0; j < item.length; j++){
                switch(item[j]){
                    case "n":
                        
                        break;
                    default:
                }
            }
        }
        return json;
    }
    //else{ // else gives that input_file contains a JSON

    //}
}