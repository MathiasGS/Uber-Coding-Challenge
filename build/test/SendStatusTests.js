"use strict";
var assert = require("chai").assert;
var SendStatus_1 = require("../server/SendStatus");
describe("SendStatus Tests", function () {
    it("Assert numeric values of enum", function () {
        assert(SendStatus_1.default.Pending === 0, "Pending should have value 0.");
        assert(SendStatus_1.default.Sent === 1, "Sent should have value 1.");
        assert(SendStatus_1.default.Rejected === 2, "Pending should have value 2.");
    });
});
