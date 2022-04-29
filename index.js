const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const config = require('./config.json');
const todolist = require('./todolist');
const cors = require('cors');

//<ms_docref_import_azuread_lib>
const BearerStrategy = require('passport-azure-ad').BearerStrategy;
//</ms_docref_import_azuread_lib>

global.global_todos = [];

//<ms_docref_azureadb2c_options>
const options = {
    identityMetadata: `https://${config.credentials.tenantName}.b2clogin.com/${config.credentials.tenantName}.onmicrosoft.com/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
    clientID: config.credentials.clientID,
    audience: config.credentials.clientID,
    policyName: config.policies.policyName,
    isB2C: config.settings.isB2C,
    validateIssuer: config.settings.validateIssuer,
    loggingLevel: config.settings.loggingLevel,
    passReqToCallback: config.settings.passReqToCallback
}

//</ms_docref_azureadb2c_options>

//<ms_docref_init_azuread_lib>
const bearerStrategy = new BearerStrategy(options, (token, done) => {
        // Send user info using the second argument
        done(null, { }, token);
    }
);
//</ms_docref_init_azuread_lib>
const app = express();

app.use(express.json()); 

//enable CORS (for testing only -remove in production/deployment)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(morgan('dev'));

app.use(passport.initialize());

passport.use(bearerStrategy);

// To do list endpoints
app.use('/api/todolist', todolist);

//<ms_docref_protected_api_endpoint>
// API endpoint, one must present a bearer accessToken to access this endpoint
app.get('/hello',
    passport.authenticate('oauth-bearer', {session: false}),
    (req, res) => {
        console.log('Validated claims: ', req.authInfo);
    
          
        // Service relies on the name claim.  
        res.status(200).json({'name': req.authInfo['name']});
    }
);
//</ms_docref_protected_api_endpoint>

//<ms_docref_anonymous_api_endpoint>
// API anonymous endpoint, returns a date to the caller.
app.get('/public', (req, res) => res.send( {'date': new Date() } ));
//</ms_docref_anonymous_api_endpoint>

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
