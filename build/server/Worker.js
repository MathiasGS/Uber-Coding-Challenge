"use strict";
var uuid = require("uuid");
var SendStatus_1 = require("./SendStatus");
var Worker = (function () {
    function Worker(dataStorage, services) {
        var _this = this;
        this.dataStorage = dataStorage;
        this.services = services;
        this.active = false;
        this.pending = false;
        this.uuid = uuid.v1();
        console.log("Starting worker with uuid " + this.uuid);
        if (this.services.length === 0) {
            throw new Error("At least one mail service must be provided.");
        }
        process.on("message", function () {
            console.log(_this.uuid + ": Got notified!");
            if (!_this.active) {
                if (_this.timer) {
                    clearTimeout(_this.timer);
                }
                _this.run();
            }
            else {
                _this.pending = true;
            }
        });
        this.run();
    }
    Worker.prototype.run = function () {
        var _this = this;
        this.active = true;
        this.pending = false;
        console.log(this.uuid + ": Doing a run.");
        this.dataStorage.retrievePending(this.uuid).then(function (pending) {
            var inProgress = [];
            var _loop_1 = function(promise) {
                inProgress.push(new Promise(function (resolve) {
                    promise.then(function (message) {
                        _this.trySend(message);
                        resolve();
                    }, function (error) {
                        resolve();
                    });
                }));
            };
            for (var _i = 0, pending_1 = pending; _i < pending_1.length; _i++) {
                var promise = pending_1[_i];
                _loop_1(promise);
            }
            console.log("inProgress: " + inProgress.length);
            Promise.all(inProgress).then(function () {
                console.log("inProgress done");
                _this.run();
            });
        }, function () {
            console.log(_this.uuid + ": No more pending messages. Sleeping for 5 minutes or until interrupted.");
            if (_this.pending) {
                _this.run();
            }
            else {
                _this.active = false;
                _this.timer = setTimeout(function () { return _this.run(); }, 300000);
            }
        });
    };
    Worker.prototype.trySend = function (message, serviceIndex) {
        var _this = this;
        if (serviceIndex === void 0) { serviceIndex = 0; }
        if (this.services.length > serviceIndex) {
            this.services[serviceIndex].send(message).then(function () {
                message.sendStatus = SendStatus_1.default.Sent;
                _this.dataStorage.put(message);
            }, function () {
                _this.trySend(message, serviceIndex + 1);
            });
        }
        else {
            message.sendStatus = SendStatus_1.default.Rejected;
            this.dataStorage.put(message);
        }
    };
    return Worker;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Worker;
