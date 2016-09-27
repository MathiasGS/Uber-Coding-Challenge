"use strict";
var restify = require("restify");
var getHandler = restify.serveStatic({
    default: "index.html",
    directory: process.env.CLIENT_FILES,
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getHandler;
