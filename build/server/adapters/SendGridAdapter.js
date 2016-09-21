"use strict";
var SendGridAdapter = (function () {
    function SendGridAdapter() {
    }
    SendGridAdapter.prototype.send = function (message) {
        return console.log("sending message");
    };
    SendGridAdapter.prototype.isAvailable = function () {
        return true;
    };
    return SendGridAdapter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SendGridAdapter;
//# sourceMappingURL=SendGridAdapter.js.map