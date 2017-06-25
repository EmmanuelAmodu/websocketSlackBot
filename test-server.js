var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));
app.use(express.static(__dirname + '/frontend'));
var dbconn = require(__dirname + "\\dbconn.js");

var WebSocketServer = require('websocket').server;
var server = require('http').createServer();
var CLIENTS=[];

//app.post('/auth', );

app.get('*', function(req, res){
    res.sendFile(__dirname + '/frontend/index.html');
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

// dropTable("users");

function dropTable(table){
    dbconn.dropTable(table);
}

function seedUsers(table, seed){
    console.log(table);
    for (el in seed) dbconn.insertToCollection(table, seed[el]);
}

server.on('request', app);

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production 
    // applications, as it defeats all standard cross-origin protection 
    // facilities built into the protocol and the browser.  You should 
    // *always* verify the connection's origin and decide whether or not 
    // to accept it. 
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed. 
  return true;
}
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin 
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    CLIENTS.push(connection);

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
