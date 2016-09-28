"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Promise = require("promise");
var Message_1 = require("../../server/Message");
var DataStorage_1 = require("../../server/storage/DataStorage");
var MockDataStorage = (function (_super) {
    __extends(MockDataStorage, _super);
    function MockDataStorage() {
        var _this = this;
        _super.apply(this, arguments);
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
}(DataStorage_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MockDataStorage;
