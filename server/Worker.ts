let uuid = require("uuid");

import IMailServiceAdapter from "./mailservices/IMailServiceAdapter";
import Message from "./Message";
import SendStatus from "./SendStatus";
import DataStorage from "./storage/DataStorage";

export default class Worker {
    private active = false;
    private pending = false;
    private uuid = uuid.v1();
    private timer: any;

    constructor(private dataStorage: DataStorage, private services: IMailServiceAdapter[]) {
        console.log("Starting worker with uuid " + this.uuid);

        if (this.services.length === 0) {
            throw new Error("At least one mail service must be provided.");
        }

        // Listen for notifications
        process.on("message", () => {
            console.log(this.uuid + ": Got notified!");

            if (!this.active) {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.run();
            } else {
                this.pending = true;
            }
        });

        // Run on init
        this.run();
    }

    private run() {
        this.active = true;
        this.pending = false;

        console.log(this.uuid + ": Doing a run.");

        this.dataStorage.retrievePending(this.uuid).then(pending => {
            // The promise interface only allow to wait for all fulfills or one rejects.
            // We need to wait for all fulfilling or rejecting.
            let inProgress: Promise<any>[] = [];

            for (let promise of pending) {
                inProgress.push(new Promise((resolve) => {
                    promise.then((message: Message) => {
                        this.trySend(message);
                        resolve();
                    }, error => {
                        // We did not get the lock, maybe someone else has it?
                        resolve();
                    });
                }));
            }

            console.log("inProgress: " + inProgress.length);
            Promise.all(inProgress).then(() => {
                console.log("inProgress done");
                this.run();
            });
        }, () => {
            console.log(this.uuid + ": No more pending messages. Sleeping for 5 minutes or until interrupted.");

            if (this.pending) {
                this.run();
            } else {
                this.active = false;
                this.timer = setTimeout(() => this.run(), 300000);
            }
        });
    }

    private trySend(message: Message, serviceIndex: number = 0) {
        if (this.services.length > serviceIndex) {
            this.services[serviceIndex].send(message).then(() => {
                // Success
                message.sendStatus = SendStatus.Sent;
                this.dataStorage.put(message);
            }, () => {
                this.trySend(message, serviceIndex + 1);
            });
        } else {
            // All failed, consider as rejection (for now)
            // TODO: Improve error handling to accurately distinguish unavailability of all services from rejection.
            message.sendStatus = SendStatus.Rejected;
            this.dataStorage.put(message);
        }
    }
}
