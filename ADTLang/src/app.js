var editor = document.getElementById("editor");
var mirror = document.getElementById("mirror");

editor.addEventListener("input", function() {
  const comp = require('./Compiler/compiler');
  let compiler = new comp.Compiler(editor.value);
  s = compiler.compile();  
  mirror.value = s;
});

