"use strict";
var Message_1 = require("../Message");
var DataStorage_1 = require("../storage/DataStorage");
function SendHandler(req, res, next) {
    var message = new Message_1.default(req.body.from, req.body.to, req.body.subject, req.body.body);
    console.log(JSON.stringify(message));
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