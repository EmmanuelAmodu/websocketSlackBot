var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var WebSocketServer = require('websocket').server;
var fs = require('fs');

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
    var user;
    
    return user;
}

wsServer.on('request', function(request) {
    let url = require('url').parse(req.httpRequest.url);
    let token = url.pathname.substring(1); // .substring(1) to strip off the leading `/`
    console.log(token);

    if (!isUserAuthorized(token)) {
      // Make sure we only accept requests from an allowed origin.
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);

    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
            sendAll(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function sendAll (message) {
    for (var i=0; i<CLIENTS.length; i++) {
        CLIENTS[i].sendUTF("Message: " + message);
    }
}
