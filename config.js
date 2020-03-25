// Update these four variables with values from your B2C tenant in the Azure portal
const clientID = "93733604-cc77-4a3c-a604-87084dd55348"; // Application (client) ID of your API's application registration
const b2cDomainHost = "fabrikamb2c.b2clogin.com";
const tenantId = "fabrikamb2c.onmicrosoft.com"; // Alternatively, you can use your Directory (tenant) ID (a GUID)
const policyName = "B2C_1_SUSI";

const config = {
    identityMetadata: "https://" + b2cDomainHost + "/" + tenantId + "/" + policyName + "/v2.0/.well-known/openid-configuration/",
    clientID: clientID,
    policyName: policyName,
    isB2C: true,
    validateIssuer: false,
    loggingLevel: 'info',
    loggingNoPII: false,
    passReqToCallback: false
}

module.exports = config;