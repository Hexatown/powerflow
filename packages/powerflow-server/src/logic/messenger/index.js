var _ = require("lodash");
var jwt = require("jsonwebtoken");
let _server = false;
function start(server) {
  _server = server;
  var aliveHandler;

  function alive() {
    //    _server.broadcast("Broadcast");
    _server.eachSocket(async (socket) => {
      // var x = await socket.send(
      //   "Hello " + socket.auth.credentials.claims.upn
      // );
    });

    aliveHandler = setTimeout(alive, 5000);
  }
  alive();
}

function send(upn, payload) {
  return new Promise((resolve, reject) => {
    if (!_server) {
      return reject("Web Socket service not started");
    }

    var receivers = 0;
    _server.eachSocket(async (socket) => {
      if (socket.auth.credentials.claims.upn === upn) {
        receivers++;
        socket.send(payload);
      }
    });
    console.log("Sending to", upn, "matched", receivers);
    resolve(receivers);
  });
}

function getSessions() {
  var sessions = [];
  _server.eachSocket(async (socket) => {
    sessions.push({ id: socket.id, info:socket.info,upn: socket.auth.credentials.claims.upn });
  });

  return sessions;
}

module.exports = {
  getSessions,
  start,
  send,
};
