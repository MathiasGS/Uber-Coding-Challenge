"use strict";
var uuid = require('uuid');
var SendStatus_1 = require("../SendStatus");
var Worker = (function () {
    function Worker(dataStorage, services) {
        var _this = this;
        this.dataStorage = dataStorage;
        this.services = services;
        this.active = false;
        this.uuid = uuid.v1();
        console.log("Starting worker with uuid " + this.uuid);
        if (this.services.length === 0) {
            throw new Error("At least one mail service must be provided.");
        }
        process.on("message", function (message) {
            if (!_this.active) {
                _this.run();
            }
        });
        this.run();
    }
    Worker.prototype.run = function () {
        var _this = this;
        this.active = true;
        var idleCounter = 0;
        this.dataStorage.retrievePending(this.uuid).then(function (messages) {
            console.log(messages);
            if (messages.length > 0) {
                idleCounter = 0;
                messages.forEach(function (message) {
                    _this.trySend(message);
                });
            }
            else {
                console.log("No pending messages. Sleeping.");
                _this.active = false;
            }
        }, function (error) {
            console.log("Worker was unable to retrieve any messages.");
        });
    };
    Worker.prototype.trySend = function (message, serviceIndex) {
        if (serviceIndex === void 0) { serviceIndex = 0; }
        if (this.services.length > serviceIndex) {
            this.services[serviceIndex].send(message).then(function () {
                message.sendStatus = SendStatus_1.default.Sent;
                dataStorage.put(message);
            }, function () {
                trySend(message, serviceIndex + 1);
            });
        }
        else {
            message.sendStatus = SendStatus_1.default.Rejected;
            dataStorage.put(message);
        }
    };
    return Worker;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Worker;
//# sourceMappingURL=Worker.js.map