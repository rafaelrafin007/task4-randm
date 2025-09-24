// ClassicMorty: never removes the gun box. Uses fair random generator for hiding and for choosing which other box to leave when needed.
module.exports = class ClassicMorty{
constructor(gameApi){ this.gameApi = gameApi; }
name(){ return 'ClassicMorty'; }
getTheoreticalProbabilities(N){
// If Morty never removes the gun and leaves exactly one other box, then:
// P(stay) = 1/N, P(switch) = (N-1)/N
return { stay: 1/N, switch: (N-1)/N };
}
// This method is called by GameCore to perform hiding. We'll request a fair number via gameApi.
async hide(N){
// request fair number: this will display HMAC and ask Rick for rick value
const r = this.gameApi.requestFairNumber(N);
// requestFairNumber returns final integer
this.hidden = r;
this.gameApi.mortyLog(`I hid the gun in box ${this.hidden}.`);
}
// returns array of indices to remove
chooseRemovals(N, rickPick){
// Remove N-2 boxes that are not hidden and not rickPick
const toRemove = [];
for(let i=0;i<N;i++){
if(i===this.hidden || i===rickPick) continue;
toRemove.push(i);
}
// If for some reason the number of toRemove > N-2 (shouldn't), trim
return toRemove.slice(0, Math.max(0, N-2));
}
};