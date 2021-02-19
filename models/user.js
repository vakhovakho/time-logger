const sha256 = require('crypto-js/sha256');
const Base64 = require('crypto-js/enc-base64');

module.exports = function (id, name, password, timeSpent = 0, timeTotal = 200, lastRecord = new Date('2021/02/19 23:59')) {
    this.id = id;
    this.name = name;
    this.timeSpent = timeSpent;
    this.timeTotal = timeTotal;
    this.lastRecord = lastRecord;
    this.password = Base64.stringify(sha256(password));
}