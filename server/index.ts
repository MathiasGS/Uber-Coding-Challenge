require('dotenv').config({silent: true});

let cluster = require('cluster');

import AzureDataStorage from "./storage/AzureDataStorage";
import MailGunAdapter from "./mailService/adapters/MailGunAdapter";
import Server from "./Application";
import SendGridAdapter from "./mailService/adapters/SendGridAdapter";
import Worker from "./mailService/Worker";

// We use Azure data storage as backend
let dataStorage = new AzureDataStorage();

// Setup the worker pool
const worker = new Worker(dataStorage, [
    new MailGunAdapter(),
    new SendGridAdapter(),
]);

// Setup the application server
const app = new Server(dataStorage, [worker]);
