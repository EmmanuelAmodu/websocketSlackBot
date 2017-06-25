var dbconn = require(__dirname + "\\dbconn.js");

var seed = [{username:"EmmaK", password:"1234"}, {username:"EmmaA", password:"1234"}];

dbconn.ifCollectionExist("users", function(table){
    dbconn.isTableEmpty(table, function(table){
        seedUsers(table, seed);
    });
}, function(table){
    dbconn.createCollection(table);
    seedUsers(table, seed);
});

dbconn.readCollections("users", {username:"EmmaA", password:"1234"}, function(res){
    console.log(res);
});

dbconn.readCollections("users", {username:"EmmaA", password:"1234"}, function(res){
    console.log(res);
});

module.exports = new authorization();
