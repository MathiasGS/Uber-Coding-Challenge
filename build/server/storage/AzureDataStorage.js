"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var azure = require("azure-storage");
var Promise = require('promise');
var uuid = require("uuid");
var DataStorage_1 = require("./DataStorage");
var Message_1 = require("../Message");
var AzureDataStorage = (function (_super) {
    __extends(AzureDataStorage, _super);
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
    AzureDataStorage.prototype.retrievePending = function (uuid) {
        var _this = this;
        var query = new azure.TableQuery()
            .top(30)
            .where('Status eq ?', '0')
            .and('Worker eq ?', '');
        return new Promise(function (resolve, reject) {
            _this.tableSvc.queryEntities(AzureDataStorage.tableName, query, null, function (error, result, response) {
                if (!error) {
                    resolve(result.entries);
                }
                else {
                    reject(error);
                }
            });
        });
    };
    AzureDataStorage.prototype.toEntity = function (message) {
        if (!message.uuid) {
            message.uuid = uuid.v1();
        }
        return {
            PartitionKey: this.entGen.String(message.sendStatus),
            RowKey: this.entGen.String(message.uuid),
            message: this.entGen.String(JSON.stringify(message)),
            worker: this.entGen.String(""),
        };
    };
    AzureDataStorage.prototype.toMessage = function (entity) {
        var message = JSON.parse(entity.message._);
        return new Message_1.default(message.from, message.to, message.subject, message.body, message.uuid, message.sendStatus);
    };
    AzureDataStorage.tableName = "messages";
    return AzureDataStorage;
}(DataStorage_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AzureDataStorage;
