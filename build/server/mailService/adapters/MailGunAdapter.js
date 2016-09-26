"use strict";
var mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain: "ubercodingchallenge.azurewebsites.net" });
var MailGunAdapter = (function () {
    function MailGunAdapter() {
    }
    MailGunAdapter.prototype.send = function (message) {
        var options = {
            from: message.from,
            html: message.body,
            subject: message.subject,
            to: message.to,
        };
        return mailgun.messages().send(options, function (error, body) {
            if (!error) {
                console.log(body);
            }
            else {
                console.log(error);
            }
        });
    };
    MailGunAdapter.prototype.isAvailable = function () {
        return true;
    };
    return MailGunAdapter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MailGunAdapter;
//# sourceMappingURL=MailGunAdapter.js.map