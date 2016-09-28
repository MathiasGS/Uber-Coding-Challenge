"use strict";
require("dotenv").config({ silent: true });
var cluster = require("cluster");
var Application_1 = require("./Application");
var MailGunAdapter_1 = require("./mailservices/MailGunAdapter");
var SendGridAdapter_1 = require("./mailservices/SendGridAdapter");
var AzureDataStorage_1 = require("./storage/AzureDataStorage");
var Worker_1 = require("./Worker");
var dataStorage = new AzureDataStorage_1.default();
var numCPUs = require("os").cpus().length;
if (cluster.isMaster) {
    var workers_1 = [];
    for (var i = 0; i < numCPUs; i++) {
        workers_1.push(cluster.fork());
    }
    cluster.on("exit", function () {
        console.log("Worker died. Spawning new worker.");
        workers_1.push(cluster.fork());
    });
    var notifyWorkers = function () {
        for (var _i = 0, workers_2 = workers_1; _i < workers_2.length; _i++) {
            var worker = workers_2[_i];
            if (!worker.isDead()) {
                worker.send("notify");
            }
        }
    };
    var app = new Application_1.default(dataStorage, notifyWorkers);
}
else {
    var worker = new Worker_1.default(dataStorage, [
        new SendGridAdapter_1.default(),
        new MailGunAdapter_1.default(),
    ]);
}
