var crypto = require('crypto');
var name = makeid();
var hash = crypto.createHash('md5').update(name).digest('hex');
console.log(hash);

function makeid() {
    var text = [];
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 10; i++ ) text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
    return text.join("");
}