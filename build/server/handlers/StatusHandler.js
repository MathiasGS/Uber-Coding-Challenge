"use strict";
var restify = require("restify");
function StatusHandler(req, res, next) {
    res.send({
        status: "pending",
        timestamp: Date.now(),
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatusHandler;
//# sourceMappingURL=StatusHandler.js.map