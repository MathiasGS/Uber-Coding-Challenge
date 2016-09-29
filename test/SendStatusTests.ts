let assert  = require("chai").assert;

import SendStatus from "../server/SendStatus";

describe("SendStatus Tests", () => {
    it("Assert numeric values of enum", () => {
        // Data storage items are stored with these values
        assert(SendStatus.Pending === 0, "Pending should have value 0.");
        assert(SendStatus.Sent === 1, "Sent should have value 1.");
        assert(SendStatus.Rejected === 2, "Pending should have value 2.");
    });
});
