const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const config = require("./config.json");
const cors = require("cors");
const BearerStrategy = require("passport-azure-ad").BearerStrategy;
const {
  executeSelectStatementWithEmail,
  executeInsertStatement,
} = require("./database");
const { sendUserToChargify } = require("./chargifyHandler");

const options = {
  identityMetadata: `https://${config.metadata.b2cDomain}/${config.credentials.tenantName}/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
  clientID: config.credentials.clientID,
  audience: config.credentials.clientID,
  policyName: config.policies.policyName,
  isB2C: config.settings.isB2C,
  validateIssuer: config.settings.validateIssuer,
  loggingLevel: config.settings.loggingLevel,
  passReqToCallback: config.settings.passReqToCallback,
  scope: config.protectedRoutes.hello.scopes,
};

const API_VERSION = "1.0.0";

const bearerStrategy = new BearerStrategy(options, (token, done) => {
  console.log("bearerStrategy", { token }); // Send user info using the second argument
  done(null, {}, token);
});

const app = express();

app.use(express.json());

//enable CORS (for testing only -remove in production/deployment)
app.use(
  cors({
    origin: "*",
  })
);

app.use(morgan("dev"));

app.use(passport.initialize());

passport.use(bearerStrategy);

app.post("/signUpConnector", (req, res) => {
  console.log("/signUpConnector", req);
  res.send({ version: API_VERSION, action: "Continue" });
});

app.post("/beforeCreatingUserConnector", async (req, res) => {
  console.log("/beforeCreatingUserConnector", req);

  console.log("sending user to database", res.body.displayName, res.body.email);
  await executeInsertStatement(res.body.displayName, res.body.email);

  console.log("sending user to chargify", res.body.displayName, res.body.email);
  await sendUserToChargify(
    res.body.email,
    res.body.givenName,
    res.body.surname
  );
  res.send({ version: API_VERSION, action: "Continue" });
});

app.post("/beforeAppClaimsConnector", (req, res) => {
  console.log("/beforeAppClaimsConnector", req);
  res.send({ version: API_VERSION, action: "Continue" });
});

app.post("/chargifyEndpoint", (req, res) => {
  console.log("/chargifyEndpoint", req);
  res.send({ status: "ok" });
});

app.get(
  "/token",
  passport.authenticate("oauth-bearer", { session: false }),
  (req, res) => {
    console.log("/token", req.authInfo);

    // Service relies on the name claim.
    res.status(200).send(
      JSON.stringify({
        token: Math.floor(Math.random() * 9999999999999999).toString(36),
      })
    );
  }
);

app.get(
  "/usage",
  passport.authenticate("oauth-bearer", { session: false }),
  (req, res) => {
    console.log("/usage", req.authInfo);

    // Service relies on the name claim.
    res.status(200).send(
      JSON.stringify({
        usage: Math.floor(Math.random() * 99),
        isSub: Math.random() < 0.5,
      })
    );
  }
);

// API endpoint
app.get(
  "/hello",
  passport.authenticate("oauth-bearer", { session: false }),
  (req, res) => {
    console.log("Validated claims: ", req.authInfo);

    // Service relies on the name claim.
    res.status(200).send(JSON.stringify({ azp: req.authInfo["azp"] }));
  }
);

// API anonymous endpoint
app.get("/public", (req, res) => res.send({ date: new Date() }));

app.get("/testEnvVar", (req, res) =>
  res.send({ date: process.env.TEST_ENV_VAR, test: 1 })
);

app.get("/testDB", async (req, res) => {
  const r = await executeSelectStatementWithEmail("michalp33@outlook.com");
  res.send({
    data: r,
    test: 1,
  });
});

app.get("/", (req, res) => res.send({ message: "hello" }));

const port = process.env.PORT || 4040;

app.listen(port, () => {
  console.log("Listening on port " + port);
});
