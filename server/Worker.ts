let uuid = require("uuid");

import IMailServiceAdapter from "./mailservices/IMailServiceAdapter";
import Message from "./Message";
import SendStatus from "./SendStatus";
import DataStorage from "./storage/DataStorage";

/**
 * Mail sending worker.
 * 
 * @export
 * @class Worker
 */
export default class Worker {
    private active = false;
    private pending = false;
    private uuid = uuid.v1();
    private timer: any;

    /**
     * Creates an instance of Worker.
     * 
     * @param {DataStorage} dataStorage
     * @param {IMailServiceAdapter[]} services Mail sending services.
     * 
     * @memberOf Worker
     */
    constructor(private dataStorage: DataStorage, private services: IMailServiceAdapter[]) {
        this.log("Starting.");

        if (this.services.length === 0) {
            this.log("At least one mail service must be provided. Exiting.");
            throw new Error("At least one mail service must be provided.");
        }

        // Listen for notifications
        process.on("message", () => {
            if (!this.active) {
                // If sleeping, clear wakeup timer and start now
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.run();
            } else {
                // Else, register that there might be pending work
                this.pending = true;
            }
        });

        // Run on init
        this.run();
    }

    /**
     * Performs the actual mail sending.
     * 
     * A batch of messages is retrieved and processed for each iteration.
     * Batch size is defined in WORKER_BATCH_SIZE.
     * 
     * @private
     * 
     * @memberOf Worker
     */
    protected run() {
        this.active = true;
        this.pending = false;

        this.log("Doing a run.");

        // Attempt to retrieve a batch of messages of the provided size
        // We may not be able to claim as many messages as we wish to
        this.dataStorage.retrievePending(this.uuid, process.env.WORKER_BATCH_SIZE).then(pending => {
            // The promise interface only allow to wait for all fulfills or one rejects
            // We need to wait for all fulfilling or rejecting
            let inProgress: Promise<any>[] = [];
            this.log("Got " + pending.length + " promises");
            for (let promise of pending) {
                inProgress.push(new Promise((resolve) => {
                    promise.then((message: Message) => {
                        this.trySend(message);
                        resolve();
                    }, error => {
                        // We did not get the lock
                        resolve();
                    });
                }));
            }

            Promise.all(inProgress).then(() => {
                this.run();
            });
        }, () => {
            this.log("Got no promises");
            if (this.pending) {
                // No pending retrieved, but notified of pending work                
                this.run();
            } else {
                this.log("Unable to retrieve any pending messages. Sleeping for a while or until interrupted.");
                this.active = false;
                this.timer = setTimeout(() => this.run(), parseInt(process.env.WORKER_SLEEP_DURATION) * 1000);
            }
        });
    }

    /**
     * Iterates through the list of service providers and attempts to send the message.
     * 
     * @private
     * @param {Message} message
     * @param {number} [serviceIndex=0]
     * 
     * @memberOf Worker
     */
    protected trySend(message: Message, serviceIndex: number = 0) {
        if (this.services.length > serviceIndex) {
            this.services[serviceIndex].send(message).then(() => {
                // Success
                message.sendStatus = SendStatus.Sent;
                this.dataStorage.put(message);
            }, () => {
                this.trySend(message, serviceIndex + 1);
            });
        } else {
            // All failed, consider as rejection
            // Further Work: Improve error handling to accurately distinguish unavailability of all services from rejection.
            message.sendStatus = SendStatus.Rejected;
            this.dataStorage.put(message);
        }
    }

    /**
     * Logs messages.
     * 
     * @private
     * @param {String} message
     * 
     * @memberOf Worker
     */
    protected log(message: String) {
        console.log(this.uuid + ": " + message);
    }
}
