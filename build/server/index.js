"use strict";
require('dotenv').config();
var Application_1 = require("./Application");
var SendGridAdapter_1 = require("./mailService/adapters/SendGridAdapter");
var Worker_1 = require("./mailService/Worker");
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var workers = [];
for (var i = 0; i < numCPUs; i++) {
    var worker = new Worker_1.default([
        new SendGridAdapter_1.default(),
    ]);
}
var app = new Application_1.default(worker);
//# sourceMappingURL=index.js.map