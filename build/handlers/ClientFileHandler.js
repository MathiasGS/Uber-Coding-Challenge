var restify = require("restify");
function getHandler(req, res, next) {
    return restify.serveStatic({
        directory: './client',
        default: 'index.html'
    });
}
exports.default = getHandler;
//# sourceMappingURL=ClientFileHandler.js.map