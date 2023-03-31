const readline = require('readline');
const comp = require('./Compiler/compiler');

// just evaluate if argument is given
if (process.argv.length > 2) {
    //const result  = evaluator.evaluate(process.argv[2]);
    //console.log(`${result}`);
    //process.exit(0);
}

// create a readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// write greeting and set the prompt
rl.write('ADTLang, Demo.\n');
rl.setPrompt('> ');
rl.prompt();

sourceCode = '';
rl.on('line', (input) => {
    if (input === '') 
    {
        rl.close();
        return;
    }

    if( input === 'compile' || input === 'comp') 
    {
        let compiler = new comp.Compiler(sourceCode);
        compiler.compile();
        rl.close();
    }

    sourceCode += input;
    rl.prompt();

}).on('close', () => {
    process.exit(0);
});