const fs = require('fs');


function usage(){
console.log('Usage: node index.js <number_of_boxes> <path_to_morty_module> [MortyClassName]');
console.log('Example: node index.js 3 ./morties/ClassicMorty/ClassicMorty.js ClassicMorty');
}


class ArgParser{
static parse(argv){
const args = argv.slice(2);
if(args.length < 2){
console.error('Error: missing arguments.');
usage();
process.exit(1);
}
const N = Number(args[0]);
if(!Number.isInteger(N) || N <= 2){
console.error(`Error: invalid box count '${args[0]}'. Please provide an integer > 2.`);
usage();
process.exit(1);
}
const mortyPath = args[1];
if(!fs.existsSync(mortyPath)){
console.error(`Error: Morty module not found at '${mortyPath}'. Check the path.`);
usage();
process.exit(1);
}
const mortyClass = args[2];
return { N, mortyPath, mortyClass };
}
}
module.exports = ArgParser;