"use strict";
const path = require("path");
var dotenv = require("dotenv").config();
const HapiDocs = require("@surveylegend/hapi-docs");
const Hapi = require("@hapi/hapi");
const api = require("./api");

const AuthBearer = require("hapi-auth-bearer-token");
const _ = require("lodash");
const AuthLogic = require("./logic/auth");
const Messenger = require("./logic/messenger");
const Nes = require("@hapi/nes");

const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("../package");

const server = Hapi.server({
  host: "localhost",
  port: process.env.port || 8000,
  //debug: { request: ['*'] } ,
  routes: {
    cors: true,
  },
});

function startService(service, name, param) {
  service(param)
    .then((r) => {
      console.log(`service ${service} stopped`, r);
    })
    .catch((e) => {
      console.log(`service ${service} stopped with error`, e);
    });
}
async function start() {
  try {
    await server.register(AuthBearer);
    await server.register(Nes);

    const swaggerOptions = {
      info: {
        title: Pack.name,
        version: Pack.version,
      },
    };

    // await server.register([
    //   Inert,
    //   //Vision,
    //   {
    //     plugin: require("hapi-ending"),
    //     options: {
    //       enabled: false,
    //       logoUrl: "/images/icon.png",
    //     },
    //   },
    // ]);
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
    ]);
    server.route({
      method: "GET",

      path: "/images/{param*}",
      config: {
        auth: false,
        description: "Asset delivery url for hapi-ending plugin",
        tags: ["metadata", "private",  "assets"],
        plugins: {
            'hapi-swagger': {
              order: 2
            }
      }
        
      },

      handler: {
        directory: {
          path: path.join(__dirname, "../static"),
          listing: true,
        },
      },
    });
    server.ext({
      type: "onPreResponse",
      method: (request, reply) => {
        console.log(request.info.remoteAddress, request.method, request.path);
        // appInsights.defaultClient.trackRequest(request, request.reponse);

        return reply.continue;
      },
    });
    server.auth.strategy("simple", "bearer-access-token", {
      allowQueryToken: false, // optional, false by default
      validate: async (request, token, h) => {
        var isValid = false;
        var claims = {};
        if (request.headers.authorization) {
          if (_.startsWith(request.headers.authorization, "Bearer ")) {
            var bearer = request.headers.authorization.substr(7);
            //  decodedValidToken

            isValid = bearer === "SharedSecret";

            // var tokenValidation =   await AuthLogic.validateAzureAdToken(bearer)

            // isValid = tokenValidation.isValid
            var response = await AuthLogic.getClaimsForToken(bearer);
            isValid = !response.hasError;
            claims = response.pto;
          }
        } else {
          var response = await AuthLogic.getClaimsForToken(token);
          isValid = !response.hasError;
          claims = response.pto;
        }
        const credentials = {
          claims,
        };

        return {
          isValid,
          credentials,
          claims,
        };
      },
    });

    server.auth.default("simple");
    await api.register(server);

    await server.start();

    Messenger.start(server);
  } catch (err) {
    console.log(err);
    //process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
}

module.exports.start = start;
