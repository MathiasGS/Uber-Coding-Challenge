"use strict";
var Promise = require("promise");
var Message_1 = require("../../server/Message");
var MockDataStorage = (function () {
    function MockDataStorage() {
        var _this = this;
        this.putInput = [];
        this.getInput = [];
        this.retrievePendingInput = [];
        this.pendingMessages = [];
        this.putHandler = function (message, resolve, reject) { return resolve(message.uuid); };
        this.getHandler = function (uuid, resolve, reject) { return resolve(new Message_1.default("", "", "", "")); };
        this.retrievePendingHandler = function (uuid, resolve, reject) {
            resolve(_this.pendingMessages.map(function (message) { return new Promise(function (resolve) { return resolve(message); }); }));
        };
    }
    MockDataStorage.prototype.put = function (message) {
        var _this = this;
        this.putInput.push(message);
        return new Promise(function (resolve, reject) {
            _this.putHandler(message, resolve, reject);
        });
    };
    MockDataStorage.prototype.get = function (uuid) {
        var _this = this;
        this.getInput.push(uuid);
        return new Promise(function (resolve, reject) {
            _this.getHandler(uuid, resolve, reject);
        });
    };
    MockDataStorage.prototype.retrievePending = function (uuid, batchSize) {
        var _this = this;
        this.retrievePendingInput.push(uuid);
        return new Promise(function (resolve, reject) {
            _this.retrievePendingHandler(uuid, resolve, reject);
        });
    };
    return MockDataStorage;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MockDataStorage;
