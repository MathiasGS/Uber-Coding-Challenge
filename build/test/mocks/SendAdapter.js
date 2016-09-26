"use strict";
var MockMailServiceAdapter = (function () {
    function MockMailServiceAdapter(sendHandler) {
        if (sendHandler === void 0) { sendHandler = function (message, resolve, reject) { return resolve(message.uuid); }; }
        this.sendHandler = sendHandler;
    }
    MockMailServiceAdapter.prototype.send = function (message) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.sendHandler(message, resolve, reject);
        });
    };
    MockMailServiceAdapter.prototype.isAvailable = function () {
        return true;
    };
    return MockMailServiceAdapter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MockMailServiceAdapter;
//# sourceMappingURL=SendAdapter.js.map