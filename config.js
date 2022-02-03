const config = {
  credentials: {
    tenantName: process.env.TENANT_NAME || "testb2cmichalp.onmicrosoft.com",
    clientID: process.env.CLIENT_ID || "e762925f-d7de-407c-b322-4f6f032687bd",
  },
  policies: {
    policyName: "B2C_1_susi",
  },
  metadata: {
    b2cDomain: process.env.B2C_DOMAIN || "testb2cmichalp.b2clogin.com",
    authority: "login.microsoftonline.com",
    discovery: ".well-known/openid-configuration",
    version: "v2.0",
  },
  settings: {
    isB2C: true,
    validateIssuer: false,
    passReqToCallback: false,
    loggingLevel: "info",
  },
  protectedRoutes: {
    hello: {
      endpoint: "/hello",
      scopes: ["demo.read"],
    },
  },
  defaultScope: [process.env.DEFAULT_SCOPE || "demo.read"],
};

module.exports = config;
