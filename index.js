// index.js - CLI entry and main game loop (updated: hide NOT revealed early; reveal at end)
const ArgParser = require('./src/ArgParser');
const MortyLoader = require('./src/MortyLoader');
const FairRandomProtocol = require('./src/FairRandomProtocol');
const StatsCollector = require('./src/StatsCollector');
const TablePrinter = require('./src/TablePrinter');
const prompt = require('prompt-sync')({sigint:true});

function uiLog(msg){ console.log(msg); }
function promptInt(msg, min, max){
  while(true){
    const s = prompt(msg+' ');
    if(s===null) process.exit(0);
    const n = Number(s);
    if(Number.isInteger(n) && n>=min && n<=max) return n;
    console.log(`Please enter integer in [${min},${max}].`);
  }
}

// simple ordinal helper: 1 -> 1st, 2 -> 2nd, 3 -> 3rd, else "Nth"
function ordinal(n){
  const v = Math.abs(n) % 100;
  const v1 = v % 10;
  if (v > 10 && v < 14) return n + 'th';
  if (v1 === 1) return n + 'st';
  if (v1 === 2) return n + 'nd';
  if (v1 === 3) return n + 'rd';
  return n + 'th';
}

// parse args
const { N, mortyPath, mortyClass } = ArgParser.parse(process.argv);

// build UI wrapper for protocol
const ui = {
  log: (m)=>uiLog(m),
  promptInt: (msg,min,max)=>promptInt(msg,min,max)
};
const protocol = new FairRandomProtocol(ui);

// gameApi for Morties
const gameApi = {
  requestFairNumber: (n)=>{
    const res = protocol.runOnce(n);
    return res.value;
  },
  mortyLog: (m)=>uiLog('Morty: '+m)
};

let morty;
try{ morty = MortyLoader.load(mortyPath, mortyClass, gameApi); }
catch(e){ console.error('Error loading Morty:', e.message); process.exit(1); }

uiLog(`Loaded Morty: ${morty.name()}`);

const stats = new StatsCollector();

(async function main(){
  while(true){
    uiLog('\n--- New round ---');
    // Morty hides (but should NOT announce the hidden box here)
    if(typeof morty.hide === 'function'){
      await morty.hide(N);
    } else {
      // fallback: request number anyway
      const hv = gameApi.requestFairNumber(N);
      morty.hidden = hv;
    }

    // Ask player for guess
    const guess = promptInt(`Rick, what's your guess [0,${N}):`,0,N-1);

    // Morty chooses removals
    let removals = [];
    try {
      const r = morty.chooseRemovals(N, guess);
      if(Array.isArray(r)) removals = r;
    } catch(e) {
      uiLog('Morty failed to choose removals; defaulting to remove lowest indices.');
      for(let i=0;i<N;i++){
        if(i===morty.hidden || i===guess) continue;
        removals.push(i);
      }
      removals = removals.slice(0, Math.max(0, N-2));
    }

    uiLog('Morty removed boxes: '+ (removals.length?removals.join(', '):'(none)'));

    // build remaining boxes
    const remaining = [];
    for(let i=0;i<N;i++) if(!removals.includes(i)) remaining.push(i);
    uiLog('Open boxes: '+ remaining.join(', '));

    // provide switching choice:
    uiLog('If you want to switch, enter index of another open box; to stay enter -1.');
    const choice = promptInt('Your choice:', -1, N-1);
    let finalChoice = guess;
    const switched = (choice !== -1 && choice !== guess);
    if(choice !== -1) finalChoice = choice;

        // reveal protocol reveals (only the latest round)
    const allReveals = protocol.getReveals();
    if(allReveals.length){
      const idx = allReveals.length - 1;
      const r = allReveals[idx];
      const ord = ordinal(idx+1);
      uiLog(`Morty: Aww man, my ${ord} random value is ${r.mortyValue}.`);
      uiLog(`Morty: KEY${idx+1}=${r.keyHex}`);
      uiLog(`Morty: So the ${ord} fair number is (${r.mortyValue} + rick) % ${N} = ${r.final}`);
    }


    // Now reveal where Morty actually hid the gun (only now)
    if(typeof morty.hidden !== 'undefined'){
      uiLog(`Morty: Your portal gun is in box ${morty.hidden}.`);
    }

    // Determine win
    const won = (finalChoice === morty.hidden);
    if(won) uiLog('Morty: Aww man, you won, Rick!');
    else uiLog('Morty: Aww man, you lost, Rick.');

    stats.addRound({ switched, won });

    const again = prompt('Do you want to play another round (y/n)? ');
    if(!again || again.toLowerCase().startsWith('n')) break;
  }

  // print summary
  const summary = stats.getSummary();
  const exact = morty.getTheoreticalProbabilities(N);
  TablePrinter.print(morty.name(), summary, exact);
  process.exit(0);
})();
