var dbconn = require(__dirname + "\\dbconn.js");
var chatroom = require(__dirname + "\\mangConn.js");
var crypto = require('crypto');
var fs = require('fs');

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
        var authHash = result.username + "-" +this.generateToken();
        result.connection = null;
        if(!fs.existsSync(__dirname+"/chatroom/onlineUsers.json")){
            fs.mkdirSync(__dirname+"/chatroom");
            fs.writeFileSync(__dirname+"/chatroom/onlineUsers.json", "{}");
        } 
        var content = fs.readFileSync(__dirname+"/chatroom/onlineUsers.json", 'utf8');
        content = JSON.parse(content);
        delete result.password;
        content[authHash] = result;
        fs.writeFileSync(__dirname+"/chatroom/onlineUsers.json", JSON.stringify(content));
        this.res.send({"username": result.username, "authHash": authHash});
    }

    this.generateToken = function(){
        var text = [];
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 10; i++ ) text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
        var name = text.join("");
        var hash = crypto.createHash('md5').update(name).digest('hex');
        return hash;
    }

    this.logout = function(req, res){
        var content = JSON.parse(fs.readFileSync(__dirname+"/chatroom/onlineUsers.json", 'utf8'));
        delete content[req.body.authHash];
        fs.writeFileSync(__dirname+"/chatroom/onlineUsers.json", JSON.stringify(content));
        res.sendStatus(200);
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
