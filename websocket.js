
//var dbconn = require('./dbconn.js');
var authen = require('./authen.js');
var server = require('http').createServer();


let wss = new WebSocketServer({ httpServer : server, autoAcceptConnections : false });

// ...so the `request` event is fired, which is needed to access the url parameters
wss.on('request', function(req) {
  // Parse the requested URL:
  let url = require('url').parse(req.httpRequest.url);
  let token = url.pathname.substring(1); // .substring(1) to strip off the leading `/`
  console.log(token);
  if (!isValidToken(token)) return req.reject();

  // Accept the request.
  return req.accept();
});
