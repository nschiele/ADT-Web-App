var button = document.getElementById("generateTreeButton");
button.addEventListener("click", function() {
  const comp = require('./Compiler/compiler');
  let editor = document.getElementById("textAreaJsonContent");
  console.log(editor.value);
  let compiler = new comp.Compiler(editor.value);
  s = compiler.compile();  
  window.attackDefenseTreeXML = s;
  console.log(s);
});

