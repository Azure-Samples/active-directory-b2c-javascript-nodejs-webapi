const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const config = require('./config.json');
const todolist = require('./todolist');
const cors = require('cors');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;


global.global_todos = [];

const options = {
    // identityMetadata: `https://${config.credentials.tenantName}.b2clogin.com/${config.credentials.tenantName}.onmicrosoft.com/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
    identityMetadata: `https://login.microsoftonline.com/${config.credentials.tenantID}/${config.metadata.version}/${config.metadata.discovery}`,
    clientID: config.credentials.clientID,
    audience: config.credentials.clientID,
    policyName: config.policies.policyName,
    isB2C: config.settings.isB2C,
    validateIssuer: config.settings.validateIssuer,
    loggingLevel: config.settings.loggingLevel,
    passReqToCallback: config.settings.passReqToCallback
}

const bearerStrategy = new BearerStrategy(options, (token, done) => {
    console.log({token})// Send user info using the second argument
    done(null, {}, token);
}
);

const app = express();

app.use(express.json());

//enable CORS (for testing only -remove in production/deployment)
app.use(cors({
    origin: '*'
}));

app.use(morgan('dev'));

app.use(passport.initialize());

passport.use(bearerStrategy);

// To do list endpoints
app.use('/api/todolist', todolist);

// API endpoint
app.get('/hello',
    passport.authenticate('oauth-bearer', { session: false }),
    (req, res) => {
        console.log('Validated claims: ', req.authInfo);


        // Service relies on the name claim.  
        res.status(200).json({ 'name': req.authInfo['name'] });
    }
);

// API anonymous endpoint
app.get('/public', (req, res) => res.send({ 'date': new Date() }));

app.get('/', (req, res) => res.send({ 'message': 'hello' }));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
