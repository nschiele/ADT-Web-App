const { create } = require('xmlbuilder2');


function appendNode(Node, refine, label)
{
  Node.ele('node', {refinement:refine})
  .ele('label').txt(label)
}

function findNode(Node, label, result)
{
  if(Node.node.nodeName === 'label' && Node.first().node.nodeValue == label)
    result.node = Node.up();
  Node.each(n => findNode(n, label, result));
  return result.node;
}

function createRoot(refine, label)
{
  var root = create({ version: '1.0' })
  .ele('adtree')
    .ele('node', {refinement: refine})
      .ele('label').txt(label).up()
  return root;
}

const r = createRoot('disjunctive','RFID Dos Attack');

appendNode(r,'disjunctive', 'Disable Tag');
appendNode(r,'disjunctive', 'Remove Tag');

var result = {node: 'a'};
dis_tag = findNode(r, 'Disable Tag', result);
console.log(result);

appendNode(dis_tag, "disjunctive", "meme");
appendNode(r,'disjunctive', 'Remove Airtag');
// convert the XML tree to string
const xml = r.end({ prettyPrint: true });

console.log(xml);
