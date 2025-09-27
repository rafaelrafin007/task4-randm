// morties/ClassicMorty/ClassicMorty.js
// ClassicMorty: never removes the gun box. Uses fair random generator for hiding and for choosing which other box to leave when needed.
module.exports = class ClassicMorty{
  constructor(gameApi){ this.gameApi = gameApi; this.hidden = undefined; }
  name(){ return 'ClassicMorty'; }
  getTheoreticalProbabilities(N){
    // If Morty never removes the gun and leaves exactly one other box:
    return { stay: 1/N, switch: (N-1)/N };
  }
  // request fair number and store hidden — DO NOT announce it here
  async hide(N){
    const r = this.gameApi.requestFairNumber(N);
    this.hidden = r;
    // intentionally do NOT log "I hid the gun in box ..." here
  }
  // returns array of indices to remove
  chooseRemovals(N, rickPick){
    // Remove N-2 boxes that are not hidden and not rickPick
    const toRemove = [];
    for(let i=0;i<N;i++){
      if(i===this.hidden || i===rickPick) continue;
      toRemove.push(i);
    }
    return toRemove.slice(0, Math.max(0, N-2));
  }
};
