let restify = require("restify");

/**
 * Handler for client files. Serves static files.
 */
let getHandler = restify.serveStatic({
    default: "index.html",
    directory: "../../client",
});

export default getHandler;
