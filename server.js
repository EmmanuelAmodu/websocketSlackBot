var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var WebSocketServer = require('websocket').server;
var fs = require('fs');
var CircularJSON = require('circular-json');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));
app.use(express.static(__dirname + '/frontend'));
var dbconn = require('./dbconn.js');
var authen = require('./authen.js');

var server = require('http').createServer();

app.post('/auth/:action', function(req, res){
    if(req.params.action == "login") authen.login(req, res);
    else if (req.params.action == "logout") authen.logout(req, res);
    else res.sendStatus(404);
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

server.on('request', app);

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
 
function isUserAuthorized(token) {
    var users = fs.readFileSync(__dirname+"/chatroom/onlineUsers.json", 'utf8');
    return JSON.parse(users)[token];
}

function updateConn(conn, token){
    var users = fs.readFileSync(__dirname+"/chatroom/onlineUsers.json", 'utf8');
    users = JSON.parse(users);
    users[token].connection = CircularJSON.stringify(conn);
    fs.writeFileSync(__dirname+"/chatroom/onlineUsers.json", JSON.stringify(users));
}

wsServer.on('request', function(request) {
    var url = require('url').parse(request.httpRequest.url);
    var token = url.pathname.substring(1); // .substring(1) to strip off the leading `/`

    if (!isUserAuthorized(token)) {
      // Make sure we only accept requests from an allowed origin.
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    //accept request
    var connection = request.accept('message-protocol', request.origin);
    connection.sendUTF("Connected at " + new Date());

    //update onlineUsers.json user data
    updateConn(connection, token);
    console.log((new Date()) + ' Connection accepted.');
    
    //send message logic
    connection.on('message', function(message) {
        var messageJSON = JSON.parse(message.utf8Data);
        if(messageJSON.type == "notification") sendAll(message);
        else if(messageJSON.type == "message") {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                sendToWho(messageJSON).sendUTF(message.utf8Data);
            } else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                sendToWho(messageJSON).sendBytes(message.binaryData);
            }
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function sendAll (message) {
    var users = fs.readFileSync(__dirname+"/chatroom/onlineUsers.json", 'utf8');
    users = JSON.parse(users);
    for(token in users){
        CircularJSON.parse(users[token].connection).sendUTF("Message: " + message);
    }
}

function fetchOnlineUser(username){
    var users = fs.readFileSync(__dirname+"/chatroom/onlineUsers.json", 'utf8');
    users = JSON.parse(users);
    for(token in users){
        if (users[token].username == username) return CircularJSON.parse(users[token].connection);
    }
}

function sendToWho(message){
    var username = message.data.username;
    return fetchOnlineUser(username);
}
