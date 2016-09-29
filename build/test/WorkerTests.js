"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var assert = require("chai").assert;
var cluster = require("cluster");
var Message_1 = require("../server/Message");
var SendStatus_1 = require("../server/SendStatus");
var Worker_1 = require("../server/Worker");
var DataStorage_1 = require("./mocks/DataStorage");
var SendAdapter_1 = require("./mocks/SendAdapter");
var TestableWorker = (function (_super) {
    __extends(TestableWorker, _super);
    function TestableWorker() {
        _super.apply(this, arguments);
        this.doRun = false;
    }
    TestableWorker.prototype.run = function () {
        if (!this.runCount) {
            this.runCount = 0;
        }
        this.runCount++;
        if (this.doRun) {
            this.doRun = false;
            return _super.prototype.run.call(this);
        }
    };
    TestableWorker.prototype.trySend = function (message, serviceIndex) {
        if (serviceIndex === void 0) { serviceIndex = 0; }
        if (!this.trySent) {
            this.trySent = [];
        }
        this.trySent.push(message);
        _super.prototype.trySend.call(this, message, serviceIndex);
    };
    TestableWorker.prototype.log = function (message) {
    };
    return TestableWorker;
}(Worker_1.default));
describe("Worker Tests", function () {
    it("Worker runs on startup.", function () {
        var dataStorage = new DataStorage_1.default();
        var worker = new TestableWorker(dataStorage, [
            new SendAdapter_1.default(),
        ]);
        assert(worker.runCount === 1, "Worker should run on startup.");
    });
    it("Worker trySends all messages from data storage.", function () {
        var dataStorage = new DataStorage_1.default();
        dataStorage.pendingMessages = [
            new Message_1.default("user@domain.com", "user@domain.com", "1", "body"),
            new Message_1.default("user@domain.com", "user@domain.com", "2", "body"),
        ];
        var worker = new TestableWorker(dataStorage, [
            new SendAdapter_1.default(),
        ]);
        worker.doRun = true;
        worker.run().then(function () {
            assert(worker.trySent && worker.trySent.length === 2, "All messages should reach trySend.");
            assert(dataStorage.putInput.length === 2, "All messages should be put to datastorage.");
            assert(dataStorage.putInput[0].sendStatus === SendStatus_1.default.Sent, "Message should get send status 'Sent'.");
            assert(dataStorage.putInput[1].sendStatus === SendStatus_1.default.Sent, "Message should get send status 'Sent'.");
        }, function () {
            assert(false, "No pending messages found.");
        });
    });
    it("trySend tries all adapters and then rejects.", function () {
        var dataStorage = new DataStorage_1.default();
        dataStorage.pendingMessages = [
            new Message_1.default("user@domain.com", "user@domain.com", "1", "body"),
        ];
        var worker = new TestableWorker(dataStorage, [
            new SendAdapter_1.default(function (message, resolve, reject) { return reject(); }),
            new SendAdapter_1.default(function (message, resolve, reject) { return reject(); }),
        ]);
        worker.doRun = true;
        return worker.run().then(function () {
            assert(dataStorage.putInput.length === 1, "The message should be put to datastorage.");
            assert(dataStorage.putInput[0].sendStatus === SendStatus_1.default.Rejected, "Message should get send status 'Rejected'.");
        }, function () {
            assert(false, "No pending messages found.");
        });
    });
    it("trySend marks message as sent when first adapter accepts it.", function () {
        var dataStorage = new DataStorage_1.default();
        dataStorage.pendingMessages = [
            new Message_1.default("user@domain.com", "user@domain.com", "1", "body"),
        ];
        var lastWorkerAttempted = false;
        var worker = new TestableWorker(dataStorage, [
            new SendAdapter_1.default(function (message, resolve, reject) { return reject(); }),
            new SendAdapter_1.default(function (message, resolve, reject) { return resolve(); }),
            new SendAdapter_1.default(function (message, resolve, reject) {
                lastWorkerAttempted = true;
                reject();
            }),
        ]);
        worker.doRun = true;
        return worker.run().then(function () {
            assert(dataStorage.putInput.length === 1, "The message should be put to datastorage.");
            assert(dataStorage.putInput[0].sendStatus === SendStatus_1.default.Sent, "Message should get send status 'Sent'.");
            assert(!lastWorkerAttempted, "The last worker should not be attempted.");
        }, function () {
            assert(false, "No pending messages found.");
        });
    });
});
