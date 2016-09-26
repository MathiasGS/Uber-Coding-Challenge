"use strict";
var MailGunAdapter_1 = require("../mailService/adapters/MailGunAdapter");
var Message_1 = require("../Message");
function SendHandler(dataStorage, workers) {
    return function (req, res, next) {
        var message = new Message_1.default(req.body.from, req.body.to, req.body.subject, req.body.body);
        if (!message.isValid()) {
            console.log("Message is not valid.");
            res.status(400);
            res.send("Invalid input.");
        }
        var adapter = new MailGunAdapter_1.default();
        adapter.send(message);
        dataStorage.put(message).then(function (uuid) {
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
//# sourceMappingURL=SendHandler.js.map