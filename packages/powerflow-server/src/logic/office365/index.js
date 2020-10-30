require("dotenv").config();
const axios = require("axios");

function callAxios(config) {
  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function getToken() {
  var qs = require("qs");
  var data = qs.stringify({
    grant_type: "client_credentials",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
  });

  var config = {
    method: "post",
    url:
      "https://login.microsoftonline.com/" +
      process.env.CLIENT_DOMAIN +
      "/oauth2/v2.0/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return callAxios(config);
}
function getSites(token) {
  var config = {
    method: "get",
    url: "https://graph.microsoft.com/v1.0/sites",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  return callAxios(config);
}
module.exports = {
  getSites
};
