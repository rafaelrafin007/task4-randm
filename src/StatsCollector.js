class StatsCollector{
constructor(){
this.rounds = 0;
this.switchCount = 0;
this.stayCount = 0;
this.winsSwitch = 0;
this.winsStay = 0;
}
addRound({ switched, won }){
this.rounds++;
if(switched){ this.switchCount++; if(won) this.winsSwitch++; }
else { this.stayCount++; if(won) this.winsStay++; }
}
getSummary(){
const estSwitch = this.switchCount? (this.winsSwitch/this.switchCount) : 0;
const estStay = this.stayCount? (this.winsStay/this.stayCount) : 0;
return {
rounds: this.rounds,
switchCount: this.switchCount,
stayCount: this.stayCount,
winsSwitch: this.winsSwitch,
winsStay: this.winsStay,
estSwitch, estStay
};
}
}
module.exports = StatsCollector;