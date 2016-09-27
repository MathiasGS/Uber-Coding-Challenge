"use strict";
var request = require("request");
var SendGridAdapter = (function () {
    function SendGridAdapter() {
    }
    SendGridAdapter.prototype.send = function (message) {
        var options = {
            auth: {
                bearer: process.env.SENDGRID_API_KEY,
            },
            json: {
                content: [
                    {
                        type: "text/html",
                        value: message.body,
                    },
                ],
                from: {
                    email: message.from,
                },
                personalizations: [
                    {
                        subject: message.subject,
                        to: [
                            {
                                email: message.to,
                            },
                        ],
                    },
                ],
            },
            method: "POST",
            uri: "https://api.sendgrid.com/v3/mail/send",
        };
        return request(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(body);
            }
            else {
                console.log(error);
            }
        });
    };
    SendGridAdapter.prototype.isAvailable = function () {
        return true;
    };
    return SendGridAdapter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SendGridAdapter;
