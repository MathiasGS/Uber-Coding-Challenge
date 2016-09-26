"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Promise = require("promise");
var DataStorage_1 = require("../../server/storage/DataStorage");
var Message_1 = require("../../server/Message");
var MockDataStorage = (function (_super) {
    __extends(MockDataStorage, _super);
    function MockDataStorage(putHandler, getHandler) {
        if (putHandler === void 0) { putHandler = function (message, resolve, reject) { return resolve(message.uuid); }; }
        if (getHandler === void 0) { getHandler = function (resolve, reject) { return resolve(new Message_1.default("", "", "", "")); }; }
        this.putHandler = putHandler;
        this.getHandler = getHandler;
        this.putInput = [];
        this.getInput = [];
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
        this.getInput.push(message);
        return new Promise(function (resolve, reject) {
            _this.getHandler(uuid, resolve, reject);
        });
    };
    MockDataStorage.prototype.retrievePending = function (uuid) {
        return new Promise(function (resolve, reject) { return resolve([]); });
    };
    return MockDataStorage;
}(DataStorage_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MockDataStorage;
//# sourceMappingURL=DataStorage.1.js.map