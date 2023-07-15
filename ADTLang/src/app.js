const comp = require('./Compiler/compiler');
let compiler = new comp.Compiler("create attack node \"asd\";");
s = compiler.compile();
console.log(s);