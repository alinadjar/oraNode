const uuidv1 = require('uuid/v4');
const _ = require('lodash');

let Seq = _.toString(uuidv1());//.replace('-', '').replace('/', '');
// Seq = _.replace(Seq, '-', '1');
console.log("GUID = " + Seq);
console.log(Seq.length);
Seq = Seq.replace(/-/g, '');

console.log("GUID = " + Seq);
console.log(Seq.length);

const { uuid } = require('uuidv4');
let uusid = uuid();
//uusid = _.replace(uusid, '-', '1');
uusid = uusid.replace(/-/g, '');

console.log("UUID = " + uusid);
console.log(uusid.length);



console.log('======================');
const d = new Date();
console.log(d.getFullYear());
console.log(d.getMonth());
console.log(d.getDay());
console.log(d.getHours());
console.log(d.getMinutes());
console.log(d.getSeconds());
console.log(d.getMilliseconds());

console.log('########################################');
//const DIC = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789abcdefghijklmnpqrstuvwxyz0123456789";
const DIC = "AB54CDaEF8219GHhI3JKLMNP6QRi7STUVWXYq8bcdefgjkl74mnprstuvwZxyz0123569";

const da = new Date();

console.log(da.getFullYear().toString());
let currentDate = ''; // da.getFullYear().toString().substring( 4, 2);






currentDate += DIC[da.getMilliseconds()%60];
currentDate += DIC[da.getSeconds()];
currentDate += DIC[da.getMinutes()];
currentDate += DIC[da.getHours()];
currentDate += DIC[da.getDay()];
currentDate += DIC[da.getMonth()];
currentDate += DIC[da.getFullYear().toString().substring( 4, 2)];


//const { uuid } = require('uuidv4');
let uuid4 = uuid();
//uusid = _.replace(uusid, '-', '1');
uuid4 = uuid4.replace(/-/g, '');
console.log(uuid4);
console.log(uuid4.toString().substr(18,3));
console.log(currentDate);

console.log('----------------------------- Bulk generate:');


const { ShortPursuitCode } = require('./helper/PersuitCodeGenerator');
for(let i = 0; i != 200 ; i++ ){
    console.log(ShortPursuitCode());
}