"use strict";
var Message = (function () {
    function Message(from, to, subject, body, uuid) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.uuid = uuid;
    }
    ;
    Message.prototype.isValid = function () {
        return true;
    };
    return Message;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Message;
//# sourceMappingURL=Message.js.map