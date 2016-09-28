let assert = require("chai").assert;
let cluster = require("cluster");

import DataStorage from "../server/storage/DataStorage";
import Message from "../server/Message";
import Worker from "../server/Worker";
import MockDataStorage from "./mocks/DataStorage";
import SendAdapter from "./mocks/SendAdapter";

class TestableWorker extends Worker {
    public runCount: number;
    public trySent: Message[];
    public doRun = false;
    public logs: String[];

    public run() {
        if (!this.runCount) {
            this.runCount = 0;
        }

        this.runCount++;

        if (this.doRun) {
            this.doRun = false;
            super.run();
        }
    }

    protected trySend(message: Message, serviceIndex: number = 0) {
        if (!this.trySent) {
            this.trySent = [];
        }

        this.trySent.push(message);
    }

    protected log(message: String) {
        if (!this.logs) {
            this.logs = [];
        }
        this.logs.push(message);
    }
}

describe("Worker Tests", () => {
    it("Worker runs on startup.", () => {
        let dataStorage = new MockDataStorage();

        let worker = new TestableWorker(dataStorage, [
            new SendAdapter(),
        ]);

        assert(worker.runCount === 1, "Worker should run on startup.");
    });

    it("Worker runs on notification.", () => {
        let dataStorage = new MockDataStorage();

        let worker = new TestableWorker(dataStorage, [
            new SendAdapter(),
        ]);


        // TODO assert(worker.runCount === 2, "Worker should run on startup.");
    });

    it("Worker trySends all messages from data storage.", () => {
        let dataStorage = new MockDataStorage();
        dataStorage.pendingMessages = [
            new Message("user@domain.com", "user@domain.com", "1", "body"),
            new Message("user@domain.com", "user@domain.com", "2", "body"),
        ];

        let worker = new TestableWorker(dataStorage, [
            new SendAdapter(),
        ]);

        worker.doRun = true;
        worker.run();

        assert(worker.trySent && worker.trySent.length === 2, "Worker should run on startup." + worker.logs.join(","));
    });

    it("Worker runs on notification.", () => {
        
    });
});
