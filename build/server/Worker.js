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
        this.log("Starting.");
        if (this.services.length === 0) {
            this.log("At least one mail service must be provided. Exiting.");
            throw new Error("At least one mail service must be provided.");
        }
        process.on("message", function () {
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
        this.log("Doing a run.");
        return this.dataStorage.retrievePending(this.uuid, process.env.WORKER_BATCH_SIZE).then(function (pending) {
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
            return Promise.all(inProgress).then(function () {
                _this.run();
            });
        }, function () {
            if (_this.pending) {
                _this.run();
            }
            else {
                _this.log("Unable to retrieve any pending messages. Sleeping for a while or until interrupted.");
                _this.active = false;
                _this.timer = setTimeout(function () { return _this.run(); }, parseInt(process.env.WORKER_SLEEP_DURATION) * 1000);
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
    Worker.prototype.log = function (message) {
        console.log(this.uuid + ": " + message);
    };
    return Worker;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Worker;
