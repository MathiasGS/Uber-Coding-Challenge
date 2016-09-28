"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var assert = require("chai").assert;
var cluster = require("cluster");
var Message_1 = require("../server/Message");
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
            _super.prototype.run.call(this);
        }
    };
    TestableWorker.prototype.trySend = function (message, serviceIndex) {
        if (serviceIndex === void 0) { serviceIndex = 0; }
        if (!this.trySent) {
            this.trySent = [];
        }
        this.trySent.push(message);
    };
    TestableWorker.prototype.log = function (message) {
        if (!this.logs) {
            this.logs = [];
        }
        this.logs.push(message);
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
    it("Worker runs on notification.", function () {
        var dataStorage = new DataStorage_1.default();
        var worker = new TestableWorker(dataStorage, [
            new SendAdapter_1.default(),
        ]);
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
        worker.run();
        assert(worker.trySent && worker.trySent.length === 2, "Worker should run on startup." + worker.logs.join(","));
    });
    it("Worker runs on notification.", function () {
    });
});
