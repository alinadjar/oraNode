
const orderid = require('order-id')('mysecret');

module.exports.GeneratePursuitCode = function () {
    return orderid.generate(); // i.g.: 3016-734428-7759
}

module.exports.WhenCreated = function (pursuitCode) {
    const time_orderCreated = orderid.getTime(pursuitCode);
    return time_orderCreated;
    // 1479812667797
    // use this to get back the time of the order in unix timestamp format 
}