"use strict";
var assert = require("chai").assert;
var SendHandler_1 = require("../server/handlers/SendHandler");
var DataStorage_1 = require("./mocks/DataStorage");
describe("Send Handler", function () {
    var notifyHandler = function (test) { return function () {
        test = true;
    }; };
    it("Adds message to data storage and notifies workers", function () {
        var notifyTest = true;
        var message;
        var dataStorage = new DataStorage_1.default();
        dataStorage.putHandler = function (m) { return message = m; };
        var sendHandler = SendHandler_1.default(dataStorage, notifyHandler(notifyTest));
        var params = {
            body: "body",
            from: "from@domain.com",
            subject: "subject",
            to: "from@domain.com",
        };
        sendHandler({
            body: params,
        }, {}, {});
        assert(message, "Message should be put to data storage.");
        assert(message.from === params.from, "Message should have provided from value.");
        assert(message.to === params.to, "Message should have provided to value.");
        assert(message.subject === params.subject, "Message should have provided subject value.");
        assert(message.body === params.body, "Message should have provided body value.");
        assert(notifyTest, "Workers should be notified.");
    });
    it("Rejects invalid message", function () {
        var notifyTest = true;
        var message;
        var status;
        var dataStorage = new DataStorage_1.default();
        dataStorage.putHandler = function (m) { return message = m; };
        var sendHandler = SendHandler_1.default(dataStorage, notifyHandler(notifyTest));
        var params = {
            body: "body",
            from: "not-an-email",
            subject: "subject",
            to: "from@domain.com",
        };
        sendHandler({
            body: params,
        }, {
            send: function (msg) { return; },
            status: function (s) {
                status = s;
            },
        }, {});
        assert(!message, "Message should not be put to data storage.");
        assert(status === 400, "Should return code 400.");
        assert(notifyTest, "Workers should not be notified.");
    });
});
