const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const config = require("./config");
const cors = require("cors");
const BearerStrategy = require("passport-azure-ad").BearerStrategy;
// const {
//   executeSelectStatementWithEmail,
//   executeInsertStatement,
// } = require("./database");
const { sendUserToChargify } = require("./chargifyHandler");
const sampleUsageData = require("./sampleUsageData");
const faker = require("faker");

// const options = {
//   identityMetadata: `https://${config.metadata.b2cDomain}/${config.credentials.tenantName}/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
//   clientID: config.credentials.clientID,
//   audience: config.credentials.clientID,
//   policyName: config.policies.policyName,
//   isB2C: config.settings.isB2C,
//   validateIssuer: config.settings.validateIssuer,
//   loggingLevel: config.settings.loggingLevel,
//   passReqToCallback: config.settings.passReqToCallback,
//   scope: config.defaultScope,
// };

const API_VERSION = "1.0.0";

// const bearerStrategy = new BearerStrategy(options, (token, done) => {
//   console.log("bearerStrategy", { token }); // Send user info using the second argument
//   done(null, {}, token);
// });

const app = express();

app.use(express.json());

//enable CORS (for testing only -remove in production/deployment)
// app.use(
//   cors({
//     origin: "*",
//   })
// );

app.use((req, response, next) => {
  response.append("Access-Control-Allow-Origin", "*");
  response.append("Access-Control-Allow-Credentials", "true");
  response.append("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.append(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Authorization, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

app.use(morgan("dev"));

// app.use(passport.initialize());

// passport.use(bearerStrategy);

app.post("/beforeAppClaimsConnector", (req, res) => {
  console.log("/beforeAppClaimsConnector", req);
  res.send({ version: API_VERSION, action: "Continue" });
});

app.post("/chargifyEndpoint", (req, res) => {
  console.log("/chargifyEndpoint", req);
  res.send({ status: "ok" });
});

app.post(
  "/api_keys",
  // passport.authenticate("oauth-bearer", { session: false }), //req.authInfo
  (req, res) => {
    console.log("/api_keys");
    const apikeyId = faker.datatype.string(16);
    temp_apiKeys = [...temp_apiKeys, apiKey(apikeyId, req.body.name)];

    res.status(200).send({
      apikey_id: apikeyId,
      key_value: faker.datatype.string(40),
    });
  }
);

app.delete(
  "/api_keys/:api_key_id",
  // passport.authenticate("oauth-bearer", { session: false }),
  (req, res) => {
    console.log("delete /api_keys", req.params.api_key_id);

    temp_apiKeys = temp_apiKeys.filter(
      (key) => key.apikey_id != req.params.api_key_id
    );

    res.status(200).send({
      status: "ok",
    });
  }
);

app.get(
  "/usage",
  // passport.authenticate("oauth-bearer", { session: false }),
  (req, res) => {
    console.log("/usage", req.authInfo);
    res.status(200).send(sampleUsageData);
  }
);

app.get(
  "/accounts",
  // passport.authenticate("oauth-bearer", { session: false }),
  (req, res) => {
    console.log("/accounts", req.authInfo);

    res.status(200).send(getAccount());
  }
);

app.post(
  "/accounts",
  // passport.authenticate("oauth-bearer", { session: false }),
  async (req, res) => {
    //await wait(5);
    res.status(200).send(getAccount());
  }
);

// API endpoint
app.get(
  "/hello",
  // passport.authenticate("oauth-bearer", { session: false }),
  (req, res) => {
    console.log("Validated claims: ", req.authInfo);

    res.status(200).send(JSON.stringify({ sub: req.authInfo["sub"] }));
  }
);

// API anonymous endpoint
app.get("/public", (req, res) => res.send({ date: new Date() }));

app.get("/testEnvVar", (req, res) =>
  res.send({ date: process.env.TEST_ENV_VAR, test: 1 })
);

app.get("/testDB", async (req, res) => {
  // const r = await executeSelectStatementWithEmail("michalp33@outlook.com");
  // res.send({
  //   data: r,
  //   test: 1,
  // });
});

app.get("/", (req, res) => res.send({ message: "hello" }));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Listening on port " + port);
});

const generateToken = () =>
  (Math.random() * 99999999999999999).toString(36).repeat(2);

const apiKey = (id = "", name = "") => ({
  apikey_id: id || generateToken(),
  name: name || faker.lorem.word(),
  created_at: faker.date.past(1),
  client_ref: faker.datatype.uuid(),
});

const wait = async (secs) => {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve();
    }, secs * 1000)
  );
};

let temp_apiKeys = [apiKey(), apiKey()];

const getAccount = () => ({
  accounts: [
    {
      account_id: 0,
      contracts: [
        {
          contract_id: 0,
          usage_limit_hrs: 5,
          projects: [
            {
              project_id: 0,
              api_keys: temp_apiKeys,
              name: faker.lorem.word(2),
            },
          ],
        },
      ],
    },
  ],
});

app.post("/signUpConnector", (req, res) => {
  console.log("/signUpConnector", req);
  res.send({ version: API_VERSION, action: "Continue" });
});

app.post("/beforeCreatingUserConnector", async (req, res) => {
  /* var header = req.headers["authorization"] || "", // get the header
    token = header.split(/\s+/).pop() || "", // and the encoded auth token
    auth = new Buffer.from(token, "base64").toString(), // convert from base64
    parts = auth.split(/:/), // split on colon
    username = parts[0],
    password = parts[1];
    */

  res.send({ version: API_VERSION, action: "Continue" });

  console.log("/beforeCreatingUserConnector", req);

  /*console.log("sending user to database", req.body.displayName, req.body.email);
  await executeInsertStatement(req.body.displayName, req.body.email);

  console.log("sending user to chargify", req.body.displayName, req.body.email);
  await sendUserToChargify(
    req.body.email,
    req.body.givenName,
    req.body.surname
  );*/
});
