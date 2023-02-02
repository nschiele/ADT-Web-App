const fs = require('fs');
const ohm = require('ohm-js');
const contents = fs.readFileSync('ADTLang.ohm', 'utf-8');
const myGrammar = ohm.grammar(contents);

a = "create attack node with 3 children \"a\",\"a\",\"a\" label is \"bank account\" has or relation";
const userInput = a
const m = myGrammar.match(userInput);
if (m.succeeded()) {
  console.log('Correct');
} else {
  console.log("Incorrect");
}