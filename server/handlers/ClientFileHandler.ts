let restify = require("restify");

/**
 * Handler for client files. Serves static files.
 * directory is specified in env as it is relative to different paths locally and deployed.
 */
let getHandler = restify.serveStatic({
    default: "index.html",
    directory: process.env.CLIENT_FILES,
});

export default getHandler;
