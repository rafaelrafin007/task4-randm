const crypto = require('crypto');
const KeyManager = require('./KeyManager');


class FairRandomProtocol{
constructor(ui){ this.ui = ui; this.reveals = []; }


// Runs the protocol for range [0, N)
// Returns an object { value, reveal() } where value is the final int and reveal() reveals morty value and key
runOnce(N){
if(!(Number.isInteger(N) && N>0)) throw new Error('Invalid N');
const key = KeyManager.genKey();
// securely choose mortyValue in [0,N)
const mortyValue = crypto.randomInt(0, N);
const msg = String(mortyValue);
const hmac = crypto.createHmac('sha3-256', key).update(msg).digest('hex').toUpperCase();
this.ui.log(`Morty: HMAC=${hmac}`);
const rickValue = this.ui.promptInt(`Rick, enter your number [0,${N}):`, 0, N-1);
const final = Number((BigInt(mortyValue) + BigInt(rickValue)) % BigInt(N));
const revealObj = { mortyValue, keyHex: KeyManager.hex(key), hmacHex: hmac, final };
// store reveal for later use
this.reveals.push(revealObj);
const reveal = ()=>revealObj;
return { value: final, reveal };
}


getReveals(){ return this.reveals.slice(); }
}


module.exports = FairRandomProtocol;