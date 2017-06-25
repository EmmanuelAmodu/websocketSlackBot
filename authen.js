var dbconn = require(__dirname + "\\dbconn.js");
var crypto = require('crypto');

var seed = [{username:"EmmaK", password:"1234"}, {username:"EmmaA", password:"1234"}];

function authorization(){

    this.login = function(req, res){
        this.res = res;
        this.req = req;
        var that = this;

        dbconn.readCollections("users", {"username": req.body.username, "password": req.body.password}, function(result){
            if(result !== null) that.createWSUser(result);
            else res.sendStatus(401);
        });
    }

    this.createWSUser = function(result){
        result.authHash = result.username + "-" +this.generateToken();
        var that = this;
        dbconn.ifCollectionExist("onlineUsers", function(table){
            that.insertOne(table, result);
        }, function(table){
            dbconn.createCollection(table);
            that.insertOne(table, result);
        });
    }

    this.insertOne = function (table, seed){
        var that = this;
        try{
            dbconn.readCollections(table, {"username": seed.username}, function(result){
                if(result == null) {
                    delete seed.password;
                    dbconn.insertToCollection(table, seed);
                    that.res.send({"username": seed.username, "authHash": seed.authHash});
                }
                else that.res.sendStatus(409);
            });
        } catch(err){
            this.res.sendStatus(500);
        }
    }

    this.generateToken = function(){
        var text = [];
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 10; i++ ) text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
        var name = text.join("");
        var hash = crypto.createHash('md5').update(name).digest('hex');
        return hash;
    }
}

module.exports = new authorization();

// dbconn.ifCollectionExist("onlineUsers", function(table){
//     dbconn.isTableEmpty(table, function(table){
//         that.insertOne(table, result);
//     });
// }, function(table){
//     dbconn.createCollection(table);
//     that.insertOne(table, result);
// });
