let uuid = require('uuid');

import DataStorage from "../storage/DataStorage";
import Message from "../Message";
import IMailServiceAdapter from "./adapters/IMailServiceAdapter";
import SendStatus from "../SendStatus";

export default class Worker {
    private active = false;
    private uuid = uuid.v1();

    constructor(private dataStorage: DataStorage, private services: IMailServiceAdapter[]) {
        console.log("Starting worker with uuid " + this.uuid);

        if (this.services.length === 0) {
            throw new Error("At least one mail service must be provided.");
        }

        // Listen for notifications
        process.on("message", (message) => {
            if (!this.active) {
                this.run();
            }
        });

        // Run on init
        this.run();
    }

    private run() {
        this.active = true;

        let idleCounter = 0;
        this.dataStorage.retrievePending(this.uuid).then((messages: Message[])  => {
            console.log(messages);
            if (messages.length > 0) {
                // Reset idle counter
                idleCounter = 0;

                messages.forEach(message => {
                    this.trySend(message);
                });
            } else {
                console.log("No pending messages. Sleeping.");
                this.active = false;
            }
        }, error => {
            console.log("Worker was unable to retrieve any messages.");
        });
    }

    private trySend(message: Message, serviceIndex: Number = 0) {
        if (this.services.length > serviceIndex) {
            this.services[serviceIndex].send(message).then(() => {
                // Success
                message.sendStatus = SendStatus.Sent;
                dataStorage.put(message);
            }, () => {
                trySend(message, serviceIndex + 1);
            });
        } else {
            // All failed, consider as rejection (for now)
            // TODO: Improve error handling to accurately distinguish unavailability of all services from rejection.
            message.sendStatus = SendStatus.Rejected;
            dataStorage.put(message);
        }
    }
}
