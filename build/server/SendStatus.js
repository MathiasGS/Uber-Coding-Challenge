"use strict";
var SendStatus;
(function (SendStatus) {
    SendStatus[SendStatus["Pending"] = 0] = "Pending";
    SendStatus[SendStatus["Sent"] = 1] = "Sent";
    SendStatus[SendStatus["Rejected"] = 2] = "Rejected";
})(SendStatus || (SendStatus = {}));
;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SendStatus;
