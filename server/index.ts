require('dotenv').config();

import Server from "./Application";
import SendGridAdapter from "./mailService/adapters/SendGridAdapter";
import Worker from "./mailService/Worker";

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

let workers = [];

for(let i = 0; i < numCPUs; i++){
const worker = new Worker([
    new SendGridAdapter(),
]);
}


const app = new Server(worker);
