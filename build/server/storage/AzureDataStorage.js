"use strict";
var azure = require("azure-storage");
var Promise = require("promise");
var uuid = require("uuid");
var Message_1 = require("../Message");
var AzureDataStorage = (function () {
    function AzureDataStorage() {
        this.tableSvc = azure.createTableService();
        this.entGen = azure.TableUtilities.entityGenerator;
        this.tableSvc.createTableIfNotExists(AzureDataStorage.tableName, function (error) {
            if (error) {
                throw new Error(error);
            }
        });
    }
    AzureDataStorage.prototype.put = function (message) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var entity = _this.toEntity(message);
            _this.tableSvc.insertOrReplaceEntity(AzureDataStorage.tableName, entity, function (error, result) {
                if (!error) {
                    resolve(entity.RowKey._);
                }
                else {
                    reject(error);
                }
            });
        });
    };
    AzureDataStorage.prototype.get = function (uuid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.tableSvc.retrieveEntity(AzureDataStorage.tableName, uuid, uuid, function (error, result) {
                if (!error) {
                    resolve(_this.toMessage(result));
                }
                else {
                    reject(error);
                }
            });
        });
    };
    AzureDataStorage.prototype.retrievePending = function (uuid, batchSize) {
        var _this = this;
        var query = new azure.TableQuery()
            .top(batchSize)
            .where("status == 0")
            .and("worker == ''")
            .or("status == 0")
            .and("Timestamp < datetime'" + new Date(Date.now() - 600000).toISOString() + "'");
        return new Promise(function (resolve, reject) {
            _this.tableSvc.queryEntities(AzureDataStorage.tableName, query, null, function (error, result) {
                if (!error && result.entries.length > 0) {
                    var out = [];
                    for (var _i = 0, _a = result.entries; _i < _a.length; _i++) {
                        var entry = _a[_i];
                        entry.worker._ = uuid;
                        out.push(_this.optimisticLock(entry));
                    }
                    resolve(out);
                }
                else {
                    reject(error);
                }
            });
        });
    };
    AzureDataStorage.prototype.optimisticLock = function (entity) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.tableSvc.replaceEntity(AzureDataStorage.tableName, entity, function (error, result) {
                if (error) {
                    reject();
                    return;
                }
                entity[".metadata"] = result[".metadata"];
                resolve(_this.toMessage(entity));
            });
        });
    };
    AzureDataStorage.prototype.toEntity = function (message) {
        if (!message.uuid) {
            message.uuid = uuid.v1();
        }
        return {
            PartitionKey: this.entGen.String(message.uuid),
            RowKey: this.entGen.String(message.uuid),
            message: this.entGen.String(JSON.stringify(message)),
            status: this.entGen.Int32(message.sendStatus),
            worker: this.entGen.String(""),
        };
    };
    AzureDataStorage.prototype.toMessage = function (entity) {
        var message = JSON.parse(entity.message._);
        return new Message_1.default(message.from, message.to, message.subject, message.body, message.uuid, message.sendStatus);
    };
    AzureDataStorage.tableName = "messages";
    return AzureDataStorage;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AzureDataStorage;
