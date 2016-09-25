"use strict";
var restify = require("restify");
var getHandler = restify.serveStatic({
    default: "index.html",
    directory: "../../client",
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getHandler;
//# sourceMappingURL=ClientFileHandler.js.map