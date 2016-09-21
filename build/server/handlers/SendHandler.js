"use strict";
var restify = require("restify");
function SendHandler(req, res, next) {
    res.send({
        service: "SendGrid",
        timestamp: "datetime",
        uuid: "uuid",
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SendHandler;
//# sourceMappingURL=SendHandler.js.map