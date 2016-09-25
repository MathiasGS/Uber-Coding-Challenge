"use strict";
var SendGridAdapter_1 = require("../mailService/adapters/SendGridAdapter");
var Message_1 = require("../Message");
var DataStorage_1 = require("../storage/DataStorage");
function SendHandler(req, res, next) {
    var message = new Message_1.default(req.body.from, req.body.to, req.body.subject, req.body.body);
    if (!message.isValid()) {
        console.log("Message is not valid.");
        res.status(400);
        res.send("Invalid input.");
        next();
    }
    console.log("Attempting send");
    var adapter = new SendGridAdapter_1.default();
    adapter.send(message);
    console.log("Attempt completed");
    DataStorage_1.default.getInstance().put(message).then(function (uuid) {
        console.log("Promise resolved");
        res.send({
            uuid: "uuid",
        });
    }, function () {
        res.status(400);
        res.send();
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SendHandler;
//# sourceMappingURL=SendHandler.js.map