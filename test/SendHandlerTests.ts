let assert = require("chai").assert;

import SendHandler from "../server/handlers/SendHandler";
import Message from "../server/Message";
import MockDataStorage from "./mocks/DataStorage";

describe("Send Handler", () => {
    it("Adds message to data storage and notifies workers", () => {
        let notifyTest = false;
        let message: Message;

        let dataStorage = new MockDataStorage();
        dataStorage.putHandler = (m) => message = m;

        let sendHandler = SendHandler(dataStorage, () => notifyTest = true);

        let params = {
            body: "body",
            from: "from@domain.com",
            subject: "subject",
            to: "from@domain.com",
        };

        sendHandler({
            body: params,
        }, {}, {}).then(() => {
            assert(message, "Message should be put to data storage.");
            assert(message.from === params.from, "Message should have provided from value.");
            assert(message.to === params.to, "Message should have provided to value.");
            assert(message.subject === params.subject, "Message should have provided subject value.");
            assert(message.body === params.body, "Message should have provided body value.");
            assert(notifyTest, "Workers should be notified.");
        }, () => {
            assert(false, "Promise should be resolved.");
        });
    });

    it("Rejects invalid message", () => {
        let notifyTest = false;
        let message: Message;
        let status: Number;

        let dataStorage = new MockDataStorage();
        dataStorage.putHandler = (m) => message = m;

        let sendHandler = SendHandler(dataStorage, () => notifyTest = true);

        let params = {
            body: "body",
            from: "not-an-email",
            subject: "subject",
            to: "from@domain.com",
        };

        sendHandler({
            body: params,
        }, {
                send: (msg: String) => { return; },
                status: (s: Number) => {
                    status = s;
                },
            }, {});

        assert(!message, "Message should not be put to data storage.");
        assert(status === 400, "Should return code 400.");
        assert(!notifyTest, "Workers should not be notified.");
    });
});