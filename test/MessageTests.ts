let assert  = require("chai").assert;

import Message from "../server/Message";

describe("Message Tests", () => {
    it("Valid mails should be accepted.", () => {
        assert(new Message("user@domain.com", "user2@domain.com", "Subject", "Body").isValid(), "Basic email should be accepted.");
        assert(new Message("user@domain.com", "user2@domain.com", "", "").isValid(), "Email with empty subject and body should be accepted.");
    });

    it("Invalid mails should be rejected.", () => {
        assert(!new Message("", "user2@domain.com", "Subject", "Body").isValid(), "Email with no from should be rejected.");
        assert(!new Message("userfdsa", "user2@domain.com", "Subject", "Body").isValid(), "Email with invalid from should be rejected.");
        assert(!new Message("user@domain.com;user2@domain.com", "user2@domain.com", "Subject", "Body").isValid(), "Email with multiple from should be rejected.");
        assert(!new Message("user@domain.com", "", "Subject", "Body").isValid(), "Email with no to should be rejected.");
        assert(!new Message("user@domain.com", "fdsafdsa", "Subject", "Body").isValid(), "Email with invalid to should be rejected.");
        assert(!new Message("user@domain.com", "user1@domain.com;user2@domain.com", "Subject", "Body").isValid(), "Email with multiple to should be rejected.");
    });
});
