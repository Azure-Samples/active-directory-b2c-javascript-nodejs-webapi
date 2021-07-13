/**
IMPORTANT: This sample code is not production ready. It's only intended as an example of how validate Azure 
AD B2C bearer token (this part can be used in production environments). The to do list methods in this module:
   - Do NOT validate user input and query string parameters.
   - The global_todos is a global variable (local memory) without using lock mechanism.
   - The CORS settings allow ANY origin.
   - Some of the methods do NOT validate the caller ID. For example, the deleted method.
   - Never tested for security, performances and usability.
**/
 
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const config = require('./config.json')

var router = express.Router();

const BearerStrategy = require('passport-azure-ad').BearerStrategy;

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

const bearerStrategy = new BearerStrategy(options, (token, done) => {
    // Send user info using the second argument
    done(null, {}, token);
}
);

// Get the caller to do list.
// GET: api/TodoItems
router.get('/',
    passport.authenticate('oauth-bearer', { session: false }),
    (req, res) => {
        console.log('Validated claims: ', req.authInfo);

        // Get the caller to do list
        var todos = getCallerTodos(req);

        // Return the caller to do list   
        res.status(200).json(todos);
    }
);

// Get a single item from the caller to do list.
// GET: api/TodoItems
router.get('/*',
    passport.authenticate('oauth-bearer', { session: false }),
    (req, res) => {
        console.log('Validated claims: ', req.authInfo);

        // Get the caller to do list
        var todos = getCallerTodos(req);

        // Find the item by id from the caller to do list
        var item = todos.find(item => item.id === parseInt(req.params[0]));

        // Return the selected item  
        res.status(200).json(item);
    }
);

// Add a new item to the global to do list
// POST: api/TodoItems
router.post('/', passport.authenticate('oauth-bearer', { session: false }),
    (req, res) => {

        // Get the max ID from the global to do list
        var maxId = 1;
        if (global_todos.length > 0)
            maxId = Math.max.apply(Math, global_todos.map(function (item) { return item.id; })) + 1;

        // Create new item and add it to the global to do list
        var item = { "id": maxId, "owner": req.authInfo['sub'], "description": req.body.description, "status": false };
        global_todos.push(item);

        // Return the new item  
        res.status(200).json(item);
    }
);

// Update an item
// PUT: api/TodoItems/5
router.put('/*',
    passport.authenticate('oauth-bearer', { session: false }),
    (req, res) => {
        console.log('Validated claims: ', req.authInfo);

        // Get the caller to do list
        var todos = getCallerTodos(req);

        // Find the item by id from the caller to do list
        var item = todos.find(item => item.id === parseInt(req.body.id));
        item.description = req.body.description;
        item.status = req.body.status;

        // Return the selected item  
        res.status(200).json(item);
    }
);

// Delate an item
// DELETE: api/TodoItems/5
router.delete('/*',
    passport.authenticate('oauth-bearer', { session: false }),
    (req, res) => {
        console.log('Validated claims: ', req.authInfo);

        // Find the item by id from the global to do list
        var item = global_todos.find(item => item.id === parseInt(req.params[0]));

        // Find the item index in the global to do list
        let pos = global_todos.findIndex(item => item.id === parseInt(req.params[0]));

        // Remove the item from the global list
        global_todos.splice(pos, 1)

        // Return the selected item  
        res.status(200).json(item);
    }
);

// Return the caller items
function getCallerTodos(req) {
    return global_todos.filter(item => item.owner === req.authInfo['sub']);
}

module.exports = router;
