"use strict";
var Message_1 = require("../Message");
var DataStorage = (function () {
    function DataStorage() {
        if (DataStorage.instance) {
            throw Error("Singleton: use getInstance() instead of new.");
        }
    }
    DataStorage.getInstance = function () {
        return DataStorage.instance;
    };
    DataStorage.prototype.put = function (message) {
        console.log("Database put");
        return new Promise(function () { return resolve("uuid"); });
    };
    DataStorage.prototype.get = function (uuid) {
        return new Promise(function () { return new Message_1.default("", "", "", ""); });
    };
    DataStorage.instance = new DataStorage();
    return DataStorage;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataStorage;
//# sourceMappingURL=DataStorage.1.js.map