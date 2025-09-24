// src/GameCore.js
// Optional GameCore helper - you can import this if you want to refactor main loop.
// This file intentionally provides a small wrapper and is not mandatory for the current index.js.

class GameCore {
  constructor({N, morty, protocol, ui, stats, tablePrinter}) {
    this.N = N;
    this.morty = morty;
    this.protocol = protocol;
    this.ui = ui;
    this.stats = stats;
    this.tablePrinter = tablePrinter;
  }

  // Example placeholder method (not used by current index.js)
  start() {
    this.ui.log('GameCore.start() is a placeholder. The main loop is in index.js for simplicity.');
  }
}

module.exports = GameCore;
