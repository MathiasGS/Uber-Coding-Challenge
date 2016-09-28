"use strict";
var Message_1 = require("../Message");
function SendHandler(dataStorage, notifyWorkers) {
    return function (req, res, next) {
        var message = new Message_1.default(req.body.from, req.body.to, req.body.subject, req.body.body);
        if (!message.isValid()) {
            res.status(400);
            res.send("Invalid input.");
        }
        dataStorage.put(message).then(function (uuid) {
            notifyWorkers();
            res.send({
                uuid: uuid,
            });
        }, function (error) {
            res.status(400);
            res.send();
        });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SendHandler;
