require("dotenv").config({ silent: true });

let cluster = require("cluster");

import Server from "./Application";
import MailGunAdapter from "./mailservices/MailGunAdapter";
import SendGridAdapter from "./mailservices/SendGridAdapter";
import AzureDataStorage from "./storage/AzureDataStorage";
import Worker from "./Worker";

/**
 * Uber Coding Challenge
 * by Mathias Grund Sørensen
 * 
 * This is the basic setup of each host. 
 * The design allows for more elaborate performance tuning, which is however out of scope.
 */


// We use Azure data storage as backend
let dataStorage = new AzureDataStorage();

// Setup the worker pool
// We run one worker for each thread
// We serve the client application from the master (see github for argumentation)
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
    // Fork workers
    let workers: any[] = [];
    for (let i = 0; i < numCPUs; i++) {
        workers.push(cluster.fork());
    }

    // Make sure we keep a constant pool of workers.
    cluster.on("exit", () => {
        console.log("Worker died. Spawning new worker.");
        workers.push(cluster.fork());
    });

    // Construct function to notify workers
    let notifyWorkers = () => {
        for (let worker of workers) {
            if (!worker.isDead()) {
                worker.send("notify");
            }
        }
    };

    // Setup the application server
    const app = new Server(dataStorage, notifyWorkers);
} else {
    // Worker thread
    const worker = new Worker(dataStorage, [
        new SendGridAdapter(),
        new MailGunAdapter(),
    ]);
}
