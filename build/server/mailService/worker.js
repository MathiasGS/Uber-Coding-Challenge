"use strict";
var Worker = (function () {
    function Worker(services) {
        this.services = services;
        console.log("Worker created");
    }
    Worker.prototype.notify = function () {
        console.log("I got notified!");
    };
    Worker.prototype.getPending = function () {
        return [];
    };
    Worker.prototype.trySend = function () {
    };
    return Worker;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Worker;
//# sourceMappingURL=Worker.js.map