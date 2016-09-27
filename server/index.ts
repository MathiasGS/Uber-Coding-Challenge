require('dotenv').config({ silent: true });

let cluster = require('cluster');

import Server from "./Application";
import MailGunAdapter from "./mailservices/MailGunAdapter";
import SendGridAdapter from "./mailservices/SendGridAdapter";
import AzureDataStorage from "./storage/AzureDataStorage";
import Worker from "./Worker";

// We use Azure data storage as backend
let dataStorage = new AzureDataStorage();

// Setup the worker pool
// We run one worker for each core
// We serve the application from the master (see github for argumentation)
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // Fork workers
    let workers: any[] = [];
    for (var i = 0; i < numCPUs; i++) {
        workers.push(cluster.fork());
    }

    cluster.on("exit", () => {
        console.log("Worker died. Spawning new worker.");
        workers.push(cluster.fork());
    });

    let notifyWorkers = () => {
        for (let worker of workers) {
            worker.send("");
        }
    }

    // Setup the application server
    const app = new Server(dataStorage, notifyWorkers);
} else {
    // Worker thread
    const worker = new Worker(dataStorage, [
        new SendGridAdapter(),
        new MailGunAdapter(),
    ]);
}
