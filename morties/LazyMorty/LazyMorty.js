// morties/LazyMorty/LazyMorty.js
// LazyMorty: never removes the gun box; removes the lowest possible indices deterministically.
module.exports = class LazyMorty{
  constructor(gameApi){ this.gameApi = gameApi; this.hidden = undefined; }
  name(){ return 'LazyMorty'; }
  getTheoreticalProbabilities(N){ return { stay: 1/N, switch: (N-1)/N }; }
  async hide(N){
    const r = this.gameApi.requestFairNumber(N);
    this.hidden = r;
    // intentionally do NOT log the hidden box here
  }
  chooseRemovals(N, rickPick){
    const toRemove = [];
    for(let i=0;i<N && toRemove.length < N-2;i++){
      if(i===this.hidden || i===rickPick) continue;
      toRemove.push(i);
    }
    return toRemove;
  }
};
