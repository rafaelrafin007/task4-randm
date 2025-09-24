const crypto = require('crypto');
class KeyManager{
static genKey(){ return crypto.randomBytes(32); } // 256 bits
static hex(key){ return key.toString('hex').toUpperCase(); }
}
module.exports = KeyManager;