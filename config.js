// Update these four variables with your values from the B2C portal
const clientID = "93733604-cc77-4a3c-a604-87084dd55348"; 
const b2cDomainHost = "fabrikamb2c.b2clogin.com";
const tenantIdGuid = "775527ff-9a37-4307-8b3d-cc311f58d925"; // alternatively, you can use your tenant name as well
const policyName = "B2C_1_SUSI";

const config = {
    identityMetadata: "https://" + b2cDomainHost + "/" + tenantIdGuid + "/" + policyName + "/v2.0/.well-known/openid-configuration/",
    clientID: clientID,
    policyName: policyName,
    isB2C: true,
    validateIssuer: false,
    loggingLevel: 'info',
    loggingNoPII: false,
    passReqToCallback: false
}

module.exports = config;