---
page_type: sample
languages:
- javascript
- node.js
products:
- microsoft-identity-platform
- azure-active-directory-b2c
description: "A sample demonstrating how to protect a Node.js web API with Azure AD B2C using the Passport.js library."
urlFragment: "active-directory-b2c-javascript-nodejs-webapi"
---

# Node.js Web API with Azure AD B2C

This sample demonstrates how to protect a Node.js web API with Azure AD B2C using the Passport.js library. The code here is pre-configured with a registered client ID. If you register your own app, you will need to replace the client ID.

To see how to call this web API from a client application, refer to this [B2C Single Page Application sample](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp).

## Contents

| File/folder       | Description                                |
|-------------------|--------------------------------------------|
| `process.json`   | Contains configuration parameters for logging via Morgan.  |
| `index.js`   | Main application logic resides here.                     |
| `config.js`   | Contains configuration parameters for the sample. |
| `.gitignore`      | Defines what to ignore at commit time.      |
| `CHANGELOG.md`    | List of changes to the sample.             |
| `CODE_OF_CONDUCT.md` | Code of Conduct information.            |
| `CONTRIBUTING.md` | Guidelines for contributing to the sample. |
| `LICENSE`         | The license for the sample.                |
| `package.json`    | Package manifest for npm.                   |
| `README.md`       | This README file.                          |
| `SECURITY.md`     | Security disclosures.                      |

## Steps to Run

1. Clone the code.

```console
git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi.git
```

2. Make sure you've installed [Node.js](https://nodejs.org/en/download/).

3. Install the node dependencies:

```console
npm install && npm update
```

4. Run the Web API! By default it will run on `http://localhost:5000`

```console
npm start
```

## Next Steps

### Using your own Azure AD B2C Tenant

To have a proper understanding of Azure AD B2C as a developer, follow the tutorials on Azure [AD B2C documentation](https://docs.microsoft.com/en-us/azure/active-directory-b2c/). In the rest of this guide, we summarize the steps you need to go through.

#### Step 1: Get your own Azure AD B2C Tenant

First, you'll need an Azure AD B2C tenant. If you don't have an existing Azure AD B2C tenant that you can use for testing purposes, you can create your own by following [these instructions](https://azure.microsoft.com/documentation/articles/active-directory-b2c-get-started).

#### Step 2: Create your own policies

This sample uses a unified sign-up/sign-in policy. You can create [your own unified sign-up/sign-in policy](https://azure.microsoft.com/documentation/articles/active-directory-b2c-reference-policies). You may choose to include as many or as few identity providers as you wish.

If you already have existing policies in your Azure AD B2C tenant, feel free to re-use those policies in this sample.  

#### Step 3: Register your own web API with Azure AD B2C

Follow the instructions at [register a Web API with Azure AD B2C](https://docs.microsoft.com/en-us/azure/active-directory-b2c/add-web-application?tabs=applications) to register the Node.js Web API sample with your tenant. Registering your Web API allows you to define the scopes that your single page application will request access tokens for.

#### Step 4: Configure your application source code

You can now fill in the variables in the `config.js` file of the Node.js Web API sample with the parameters you've obtained from the Azure Portal during the steps above.

Configure the following variables:

```javascript
const clientID = "<Application ID for your Node.js Web API - found on Properties page in Azure portal e.g. 93733604-cc77-4a3c-a604-87084dd55348>";
const b2cDomainHost = "<Domain of your B2C host eg. fabrikamb2c.b2clogin.com>";
const tenantIdGuid = "<Application ID for your Node.js Web API - found on Properties page in Azure portal e.g. 775527ff-9a37-4307-8b3d-cc311f58d925>";
const policyName = "<Name of your sign in / sign up policy, e.g. B2C_1_SUSI>";
```

> **NOTE**
>
>Developers using the [Azure China Environment](https://docs.microsoft.com/en-us/azure/active-directory/develop/authentication-national-cloud), MUST use <your-tenant-name>.b2clogin.cn authority, instead of `login.chinacloudapi.cn`.
>
> In order to use <your-tenant-name>.b2clogin.*, you will need to configure you application and set `validateAuthority: false`. Learn more about using [b2clogin](https://docs.microsoft.com/en-us/azure/active-directory-b2c/b2clogin#set-the-validateauthority-property).

Lastly, to run your Node.js Web API, run the following command from your shell or command line

```bash
npm install && npm update
npm start
```

Your Node.js Web API sample is now running on Port 5000.

## Questions & Issues

Please file any questions or problems with the sample as a GitHub issue.  You can also post on Stack Overflow with the tag `azure-ad-b2c`. For OAuth2.0 library issues, please see note below.

## Contributing

If you'd like to contribute to this sample, see [CONTRIBUTING.MD](./CONTRIBUTING.md).

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.