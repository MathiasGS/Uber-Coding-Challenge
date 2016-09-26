"use strict";
var restify = require("restify");
function SendHandler(dataStorage) {
    return function (req, res, next) {
        dataStorage.get(req.params.uuid).then(function (message) {
            res.send(message);
        }, function (error) {
            res.status(400);
            res.send();
        });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SendHandler;
//# sourceMappingURL=StatusHandler.js.map