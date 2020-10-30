var MESSENGER = require("../messenger");

function action(upn, args) {
  return MESSENGER.send(upn, args);
}
function getSessions() {
  return MESSENGER.getSessions();
}

module.exports = {
  action,getSessions
};
