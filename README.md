---
page_type: sample
description: "This sample demonstrates how to protect a Node.js web API with Azure AD B2C using the Passport.js library."
languages:
- javascript
- nodejs
products:
- azure
- azure-active-directory
urlFragment: nodejs-web-api-azure-ad
---


# Node.js Web API with Azure AD B2C

This sample demonstrates how to protect a Node.js web API with Azure AD B2C using the Passport.js library. The code here is pre-configured with a registered client ID. If you register your own app, you will need to replace the client ID.

We have deployed this API to Azure to allow testing without running it locally. Checkout one of the apps in [Next Steps](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi/blob/master/README.md#next-steps) to use it!

## Steps to Run

1. Clone the code.

	```bash
	git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi
	```

2. Make sure you've [installed Node](https://nodejs.org/en/download/).

4. Install the node dependencies: 

	```bash
	npm install && npm update
	```
5. Run the Web API! By default it will run on `http://localhost:5000`.
	```bash
	node index.js
	```

## Next Steps
The `/hello` endpoint in this sample is protected so an authorized request to it requires an access token in the header. 
You can make authorized requests to this web API using an [iOS App](https://github.com/Azure-Samples/active-directory-b2c-ios-swift-native-msal) or [Android App](https://github.com/Azure-Samples/active-directory-b2c-android-native-msal). Make sure to update the app configs if you want it to point to your local hello api. 

Alternatively, you can [register your own app](https://apps.dev.microsoft.com) and point to this web API.

Customize your user experience further by supporting more identity providers.  Checkout the docs belows to learn how to add additional providers: 

- [Microsoft](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-setup-msa-app)
- [Facebook](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-setup-fb-app)
- [Google](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-setup-goog-app)
- [Amazon](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-setup-amzn-app)
- [LinkedIn](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-setup-li-app)


## Questions & Issues

Please file any questions or problems with the sample as a GitHub issue.  You can also post on Stack Overflow with the tag `azure-ad-b2c`. For OAuth2.0 library issues, please see note below. 
