"use strict";
require('dotenv').config({ silent: true });
var cluster = require('cluster');
var AzureDataStorage_1 = require("./storage/AzureDataStorage");
var MailGunAdapter_1 = require("./mailService/adapters/MailGunAdapter");
var Application_1 = require("./Application");
var SendGridAdapter_1 = require("./mailService/adapters/SendGridAdapter");
var Worker_1 = require("./mailService/Worker");
var dataStorage = new AzureDataStorage_1.default();
var worker = new Worker_1.default(dataStorage, [
    new MailGunAdapter_1.default(),
    new SendGridAdapter_1.default(),
]);
var app = new Application_1.default(dataStorage, [worker]);
//# sourceMappingURL=index.js.map