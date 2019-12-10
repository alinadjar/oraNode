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
uusid = uusid.replace(/-/g,'');

console.log("UUID = " + uusid);
console.log(uusid.length);