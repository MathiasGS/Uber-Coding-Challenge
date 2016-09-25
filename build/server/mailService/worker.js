"use strict";
var Worker = (function () {
    function Worker(services) {
        this.services = services;
    }
    Worker.prototype.notify = function () {
        console.log("I got notified!");
    };
    Worker.prototype.getPending = function () {
        return [];
    };
    Worker.prototype.trySend = function (message, service) {
        return service.send(message);
    };
    return Worker;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Worker;
//# sourceMappingURL=Worker.js.map