"use strict";
var request = require("request");
var MailGunAdapter = (function () {
    function MailGunAdapter() {
    }
    MailGunAdapter.prototype.send = function (message) {
        var options = {
            auth: {
                password: process.env.MAILGUN_API_KEY,
                user: "api",
            },
            form: {
                from: message.from,
                html: message.body,
                subject: message.subject,
                to: message.to,
            },
            method: "POST",
            uri: "https://api.mailgun.net/v3/" + process.env.MAILGUN_API_USER + "/messages",
        };
        return new Promise(function (resolve, reject) {
            request(options, function (error, response, body) {
                var parsedBody = JSON.parse(body);
                if (!error && parsedBody.id) {
                    resolve();
                }
                else {
                    reject(error || parsedBody.message);
                }
            });
        });
    };
    return MailGunAdapter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MailGunAdapter;
