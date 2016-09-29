let assert = require("chai").assert;
let cluster = require("cluster");

import Message from "../server/Message";
import SendStatus from "../server/SendStatus";
import Worker from "../server/Worker";
import MockDataStorage from "./mocks/DataStorage";
import SendAdapter from "./mocks/SendAdapter";

/**
 * Extension of the Worker class for improved testability
 * 
 * @class TestableWorker
 * @extends {Worker}
 */
class TestableWorker extends Worker {
    public runCount: number;
    public trySent: Message[];
    public doRun = false;

    public run() {
        if (!this.runCount) {
            this.runCount = 0;
        }

        this.runCount++;

        if (this.doRun) {
            this.doRun = false;
            return super.run();
        }
    }

    protected trySend(message: Message, serviceIndex: number = 0) {
        if (!this.trySent) {
            this.trySent = [];
        }

        this.trySent.push(message);

        super.trySend(message, serviceIndex);
    }

    protected log(message: String) {
        // Silence logging
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
        worker.run().then(() => {
            assert(worker.trySent && worker.trySent.length === 2, "All messages should reach trySend.");
            assert(dataStorage.putInput.length === 2, "All messages should be put to datastorage.");
            assert(dataStorage.putInput[0].sendStatus === SendStatus.Sent, "Message should get send status 'Sent'.");
            assert(dataStorage.putInput[1].sendStatus === SendStatus.Sent, "Message should get send status 'Sent'.");
        }, () => {
            assert(false, "No pending messages found.");
        });
    });

    it("trySend tries all and then rejects.", () => {
        let dataStorage = new MockDataStorage();
        dataStorage.pendingMessages = [
            new Message("user@domain.com", "user@domain.com", "1", "body"),
        ];

        let worker = new TestableWorker(dataStorage, [
            new SendAdapter((message, resolve, reject) => reject()),
            new SendAdapter((message, resolve, reject) => reject()),
        ]);

        worker.doRun = true;
        return worker.run().then(() => {
            assert(dataStorage.putInput.length === 1, "The message should be put to datastorage.");
            assert(dataStorage.putInput[0].sendStatus === SendStatus.Rejected, "Message should get send status 'Rejected'.");
        }, () => {
            assert(false, "No pending messages found.");
        });
    });

    it("trySend marks message as sent when first adapter accepts it.", () => {
        let dataStorage = new MockDataStorage();
        dataStorage.pendingMessages = [
            new Message("user@domain.com", "user@domain.com", "1", "body"),
        ];

        let lastWorkerAttempted = false;
        let worker = new TestableWorker(dataStorage, [
            new SendAdapter((message, resolve, reject) => reject()),
            new SendAdapter((message, resolve, reject) => resolve()),
            new SendAdapter((message, resolve, reject) => {
                lastWorkerAttempted = true;
                reject();
            }),
        ]);

        worker.doRun = true;
        return worker.run().then(() => {
            assert(dataStorage.putInput.length === 1, "The message should be put to datastorage.");
            assert(dataStorage.putInput[0].sendStatus === SendStatus.Sent, "Message should get send status 'Sent'.");
            assert(!lastWorkerAttempted, "The last worker should not be attempted.");
        }, () => {
            assert(false, "No pending messages found.");
        });
    });
});
