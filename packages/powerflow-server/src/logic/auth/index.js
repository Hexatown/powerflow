var _ = require("lodash");
var jwt = require("jsonwebtoken");

var atob = require("atob");
const axios = require("axios");
//var SQL = require("../../services/sql");
var jwt = require("jsonwebtoken");
const secret =
  "MIIC8TCCAdmgAwIBAgIQfEWlTVc1uINEc9RBi6qHMjANBgkqhkiG9w0BAQsFADAjMSEwHwYDVQQDExhsb2dpbi5taWNyb3NvZnRvbmxpbmUudXMwHhcNMTgxMDE0MDAwMDAwWhcNMjAxMDE0MDAwMDAwWjAjMSEwHwYDVQQDExhsb2dpbi5taWNyb3NvZnRvbmxpbmUudXMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDEdJxkw+jwWJ+gNyuCdxZDuYYm2IqGuyGjT64U9eD452dEpi51MPv4GrUwONypZF/ch8NWMUmLFBLrUzvCb3AAsOP76Uu4kn2MNQBZMDfFa9AtuIEz6CpTSyPiZzaVabqc9+qXJh5a1BxILSxiQuVrI2BfiegoNpeK+FU6ntvAZervsxHN4vj72qtFgqO7Md9kvuQ0EKyo7Xzk/Q0jYm2bD4SypiysJoex81EZGtO9QdSreFZrzn2Qr/m413tN5jZkTApUPx7MKZJ9Hn1nPLFO24+mQJIdL061S9LeapNiK3vepy+muOXdHyGmNctvyh+1+laveEVF2nGvC6hAQ7hBAgMBAAGjITAfMB0GA1UdDgQWBBQ5TKadw06O0cvXrQbXW0Nb3M3h/DANBgkqhkiG9w0BAQsFAAOCAQEAI48JaFtwOFcYS/3pfS5+7cINrafXAKTL+/+he4q+RMx4TCu/L1dl9zS5W1BeJNO2GUznfI+b5KndrxdlB6qJIDf6TRHh6EqfA18oJP5NOiKhU4pgkF2UMUw4kjxaZ5fQrSoD9omjfHAFNjradnHA7GOAoF4iotvXDWDBWx9K4XNZHWvD11Td66zTg5IaEQDIZ+f8WS6nn/98nAVMDtR9zW7Te5h9kGJGfe6WiHVaGRPpBvqC4iypGHjbRwANwofZvmp5wP08hY1CsnKY5tfP+E2k/iAQgKKa6QoxXToYvP7rsSkglak8N5g/+FJGnq4wP6cOzgZpjdPMwaVt5432GA==";
const validateAzureAdToken = (accessToken) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://login.microsoftonline.com/common/.well-known/openid-configuration"
      )
      .then(function (response) {
        //     var config = JSON.parse(response);
        // handle success
        //console.log(response.data);
        axios.get(response.data.jwks_uri).then((jwks) => {
          try {
            var header = JSON.parse(atob(accessToken.split(".")[0]));

            var x5c = jwks.data.keys[0].x5c[0];
            //      "MIIDBTCCAe2gAwIBAgIQdRnV9VlJ0JZDXnbfp+XqZjANBgkqhkiG9w0BAQsFADAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MB4XDTE5MDcxNTAwMDAwMFoXDTIxMDcxNTAwMDAwMFowLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOvLcdnJzn5Lx3+9OXPmSGX14ssROnPS6sVUA4yLPvQ27wxCO+Od5GYvbb0GM7JCRXQZQ/DGLlYV/AaYv2FBRfHqCdTxQtv/NrA4RfpjSe7D62LIDCQC9638zikGqcd5vUT0vtfCgGToPkiA8GzXKw5ua2MOaF4to2zuHLSs0Sj94857xw3i5ywk3JwxpDAkQbhDSboMIe6B47RqYdS97zaSNpa6Adxytk3A9TK+XGE3K3fo+m5pPC0XsCwiY4qWcJrtw4luP5EZ4oMPDuQZmIDGJFmexpdOPCgWS/uz8h0wF2+7TKfRXSX1mPl7vSgfWsgFvOBmwjCe6qKI8KAg290CAwEAAaMhMB8wHQYDVR0OBBYEFCle84Tr3/8aZbTs2jryx2w21ANZMA0GCSqGSIb3DQEBCwUAA4IBAQAZsQq6JX4IFDXjfV9UnauPP2E5OUMQvqnNasAATucYctaeW307aQEhB4OQgFDKKUpcN4RHOLqxG4phqUhI72PzW8kNVjGvgSL+uXO7P0mYi0N+ujGXYi92ZzH9tODODQ2147ZDLDe0kiRB9KXwFLdJcY6dbkj0wVmIy4D5JtB9zTRj4R5ymWXCXz3ecN4DhjeZnjnZfxaqJJA6lbWLIcjenKjRXoW95WgtdSu2gpjaJCt4zITTw1cFL6sdHrcsT24j23EpNxUld8C/3IY8ac72HKMR5AloTRlXxwXM8XUwLcrUCVp0c61VNY6U2J0TXYdSvJHwSQ98wSbiSryT2SUk";

            const key = `-----BEGIN CERTIFICATE-----\n${x5c}\n-----END CERTIFICATE-----`;
            var isValid = jwt.verify(accessToken, key);
            resolve({ isValid });
          } catch (error) {
            console.log("Token validation error", error);
            return resolve({ isValid: false, error });
          }
        });
      })
      .catch(function (error) {
        // handle error
        console.log("Token validation error", error);
        return resolve({ isValid: false, error });
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  });
};

// //const authorizationHeader = req.headers.authorization;
// //const decodedToken = (decodedValidToken(authorizationHeader.replace('Bearer ','')) );
// var token =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCIsImtpZCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCJ9.eyJhdWQiOiI4OWJlZTFmNy01ZTZlLTRkOGEtOWYzZC1lY2Q2MDEyNTlkYTciLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83OWRjMjI4Zi1jOGYyLTQwMTYtOGJmMC1iOTkwYjZjNzJlOTgvIiwiaWF0IjoxNTY4MDQ0MDI1LCJuYmYiOjE1NjgwNDQwMjUsImV4cCI6MTU2ODA0NzkyNSwiYWlvIjoiQVZRQXEvOE1BQUFBN0dBd1FnQU4vUW9BaXliNTZOb3I4enhTQkFmRjdOL1hDQ2NRVTVqd3VmMWFhZ0RmanRQaEk3Nmc5NW5ZYTFmSnpHSDZ0Z1JtQTRTMktueHo1SVpzUmZyQktoTTQwTTIwZWpXbXdvdldsYXM9IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJmYW1pbHlfbmFtZSI6IkpvaGFuc2VuIChBRE1JTikiLCJnaXZlbl9uYW1lIjoieiBOaWVscyBHcmVnZXJzIiwiaXBhZGRyIjoiODAuMTYwLjEyNi4yNTQiLCJuYW1lIjoieiBOaWVscyBHcmVnZXJzIEpvaGFuc2VuIChBRE1JTikiLCJub25jZSI6ImRiZWUxY2Y1LTMzNzQtNGE5Zi1iZjMwLWE4MjY5OWRiZTAyZCIsIm9pZCI6IjFmNTJkMGZlLTllMTEtNDgxNC1iOTY3LTlmN2JkNzZmYjdmNiIsInB1aWQiOiIxMDAzM0ZGRjgwRDE4OTdEIiwicHdkX2V4cCI6IjE3MTM5OSIsInB3ZF91cmwiOiJodHRwczovL3BvcnRhbC5taWNyb3NvZnRvbmxpbmUuY29tL0NoYW5nZVBhc3N3b3JkLmFzcHgiLCJzdWIiOiJRU3FReHZEeUQyNUtKMDFGaVJGQWRialU5bWZTWWFxTmt0dDJvdVhVUmxFIiwidGlkIjoiNzlkYzIyOGYtYzhmMi00MDE2LThiZjAtYjk5MGI2YzcyZTk4IiwidW5pcXVlX25hbWUiOiJhZG1pbi1uZ2pvaEBuZXRzLmV1IiwidXBuIjoiYWRtaW4tbmdqb2hAbmV0cy5ldSIsInV0aSI6ImFDaDY2MGk3MEVDblVRTW04alJ3QVEiLCJ2ZXIiOiIxLjAifQ.ePqCYRMJi-AiMIGUCZ6RV67-IHsrs_UDdhJBvPaX803kyoMb6ZUB9N2OBOhKrjAHkmV_BKAxOl6q7aKyzKMHxUo8SdZjLiiijujLRSZbxmpyvF1G0YP-MzJNPTFQUCFQKN3zvUIp27rH8LFfxzRoDKBmRq-MO7Z7NkLDF2rJOmucG7lTu3IXY58xM9eYWUmPPGPi9MBC8f-fMvUwdtDmA1cls4yjRhfbFwU3FPP55d2d_hdqs2v8_wLtMMg2v0GCag3k10ERc2Kkn_rTFu52AYJBeYB6AikK8Q7M4RiaBHb7Afj3Sy3QGLT-dZGkSIhFUqFsSYbRgM8Lu2c9T07Vig"
// decodedValidToken(token).then(tokenValidateion =>
//   console.log(tokenValidateion)
// );
async function isAuthorized(resource, owner, upn) {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
}

async function getTokenForMSAL(msalToken, fromIpAddress, fromCountryCode) {
  try {
    // https://www.npmjs.com/package/azure-ad-jwt
    var msal = JSON.parse(atob(msalToken.split(".")[1]));

    var orgGUID = msal.tid;
    var userGUID = msal.oid;
    var upn = msal.upn ? msal.upn : msal.preferred_username;
    var givenName = msal.givenName;
    var familyName = msal.familyName;
    var displayName = msal.name;
    var domain = upn ? upn.split("@")[1] : "";

    var claim = {
      upn,
      domain,
      orgGUID,
      userGUID,
      msal,
      givenName,
      familyName,
      displayName,
    };

    var token = jwt.sign(JSON.stringify(claim), secret);

    return {
      hasError: false,
      token,
    };
  } catch (error) {
    return {
      hasError: true,
      error,
    };
  }
}

async function getTokenForWin(upn) {
  try {
    var domain = upn ? upn.split("@")[1] : "";

    var claim = {
      upn,
      domain
    };

    var token = jwt.sign(JSON.stringify(claim), secret);

    return {
      hasError: false,
      token,
    };
  } catch (error) {
    return {
      hasError: true,
      error,
    };
  }
}

async function getClaimsForToken(ptoToken) {
  try {
    var pto = jwt.verify(ptoToken, secret);

    return {
      hasError: false,
      pto,
    };
  } catch (error) {
    return {
      hasError: true,
      error,
    };
  }
}
// console.log( JSON.stringify(decodedValidToken(token)))
module.exports = {
  getClaimsForToken,
  getTokenForMSAL,
  getTokenForWin,
  validateAzureAdToken,
  isAuthorized,
};
