"use strict";
var SendStatus_1 = require("./SendStatus");
var Message = (function () {
    function Message(from, to, subject, body, uuid, sendStatus) {
        if (sendStatus === void 0) { sendStatus = SendStatus_1.default.Pending; }
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.uuid = uuid;
        this.sendStatus = sendStatus;
    }
    ;
    Message.prototype.isValid = function () {
        return true;
    };
    return Message;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Message;
