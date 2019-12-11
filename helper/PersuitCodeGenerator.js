
const orderid = require('order-id')('mysecret');
const _ = require('lodash');
const { uuid } = require('uuidv4');

module.exports.GeneratePursuitCode = function () {
    return orderid.generate(); // i.g.: 3016-734428-7759
}

module.exports.WhenCreated = function (pursuitCode) {
    const time_orderCreated = orderid.getTime(pursuitCode);
    return time_orderCreated;
    // 1479812667797
    // use this to get back the time of the order in unix timestamp format 
}


module.exports.ShortPursuitCode = function () {
    //const DIC = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789abcdefghijklmnpqrstuvwxyz0123456789";
    const DIC = "AB054CDaEF8219GuHhI3JtKLMP6QRi7STsWXYqbcdefgjklmnpUVrvwZxyNz0123456789";

    const d = new Date();
    let uuid4 = uuid();
    //uusid = _.replace(uusid, '-', '1');
    uuid4 = uuid4.replace(/-/g, '');

    //console.log(d.getFullYear().toString());
    let output = '';

    output += DIC[d.getMilliseconds() % 60];
    output += DIC[d.getSeconds()];
    output += DIC[d.getMinutes()];
    output += DIC[d.getHours()];
    output += uuid4.toString().substr(20, 1);
    output += DIC[d.getDay()];
    output += DIC[d.getMonth()];
    output += DIC[d.getFullYear().toString().substring(4, 2)];
    output += uuid4.toString().substr(18, 2);

    return output;


}