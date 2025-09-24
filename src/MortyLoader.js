// src/MortyLoader.js
const path = require('path');

class MortyLoader {
  static load(modulePath, className, gameApi) {
    const abs = path.resolve(modulePath);
    let mod;
    try {
      mod = require(abs);
    } catch (e) {
      throw new Error(`Failed to load Morty module: ${e.message}`);
    }

    let MortyClass = null;

    // If user provided explicit class name, try to find it in common places
    if (className) {
      if (mod && typeof mod === 'object' && mod[className]) MortyClass = mod[className];
      else if (mod && mod.default && mod.default[className]) MortyClass = mod.default[className];
      else if (mod && typeof mod === 'function' && mod.name === className) MortyClass = mod; // class exported directly but with name
      else MortyClass = null;
    } else {
      // No class name provided — try to find a reasonable export
      if (typeof mod === 'function') {
        // module.exports = class ...
        MortyClass = mod;
      } else if (mod && typeof mod === 'object') {
        // prefer default, then common names, then first function export
        MortyClass = mod.default || mod.ClassicMorty || mod.Morty || null;
        if (!MortyClass) {
          const funcs = Object.values(mod).filter(v => typeof v === 'function');
          if (funcs.length) MortyClass = funcs[0];
        }
      }
    }

    if (!MortyClass) {
      throw new Error('Morty class not found in module. Provide class name or export a class as default/module.exports.');
    }

    // instantiate the class
    let inst;
    try {
      inst = new MortyClass(gameApi);
    } catch (e) {
      throw new Error(`Failed to instantiate Morty class: ${e.message}`);
    }

    // validate required methods
    const ok =
      inst &&
      typeof inst.name === 'function' &&
      typeof inst.getTheoreticalProbabilities === 'function' &&
      typeof inst.chooseRemovals === 'function';

    if (!ok) {
      throw new Error('Loaded Morty does not implement required methods (name, getTheoreticalProbabilities, chooseRemovals).');
    }

    return inst;
  }
}

module.exports = MortyLoader;
