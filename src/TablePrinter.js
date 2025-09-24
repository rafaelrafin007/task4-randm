const Table = require('cli-table3');


class TablePrinter{
static print(mortyName, stats, exact){
const table = new Table({ head: ['Game results','Rick switched','Rick stayed'] });
table.push([
'Rounds', stats.switchCount+'', stats.stayCount+'',
]);
table.push(['Wins', stats.winsSwitch+'', stats.winsStay+'']);
table.push(['P (estimate)', stats.estSwitch.toFixed(3), stats.estStay.toFixed(3)]);
table.push(['P (exact)', exact.switch.toFixed(3), exact.stay.toFixed(3)]);
console.log('\nGAME STATS');
console.log(table.toString());
}
}
module.exports = TablePrinter;