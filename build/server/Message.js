"use strict";
var SendStatus_1 = require("./SendStatus");
var Validator_1 = require("./Validator");
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
        return Validator_1.default.isEmail(this.from) && Validator_1.default.isEmail(this.to) && Validator_1.default.hasValue(this.subject) && Validator_1.default.hasValue(this.body);
    };
    return Message;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Message;
