/* 
*
*   Creat and export configuration variables
*
*/

//  declare the environments object
let environments = {};

//  declare the staging environment settings
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging'
};

// declare the production environment settings
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production'
};

// read the environement requested through command line
requestedEnvironment = typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// see if the requested environment exists in the configuration
environmentToExport =
  typeof environments[requestedEnvironment] == 'object' ? environments[requestedEnvironment] : environments.staging;

// export the environment settings
module.exports = environmentToExport;
