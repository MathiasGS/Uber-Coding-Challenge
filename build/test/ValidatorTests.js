"use strict";
var assert = require("chai").assert;
var Validator_1 = require("../server/Validator");
describe("Validator Tests", function () {
    it("Invalid emails rejected", function () {
        assert(!Validator_1.default.isEmail(undefined), "undefined email should not be accepted.");
        assert(!Validator_1.default.isEmail(null), "null email should not be accepted.");
        assert(!Validator_1.default.isEmail(""), "Empty email should not be accepted.");
        assert(!Validator_1.default.isEmail("test"), "No @ email should not be accepted.");
        assert(!Validator_1.default.isEmail("test@"), "No domain email should not be accepted.");
        assert(!Validator_1.default.isEmail("test@domain"), "No tld email should not be accepted.");
        assert(!Validator_1.default.isEmail("test@domain.dk;test2@domain.dk"), "Multiple emails should not be accepted.");
        assert(!Validator_1.default.isEmail("test@doma in.dk"), "Email with whitespace should not be accepted.");
    });
    it("Valid emails should be accepted", function () {
        assert(Validator_1.default.isEmail("test@domain.dk"), "Basic email should be accepted.");
        assert(Validator_1.default.isEmail("test@domain.co.uk"), "Basic email with multi-dot tld should be accepted.");
    });
    it("hasValue should work for all data types", function () {
        assert(Validator_1.default.hasValue(""), "hasValue should work for strings.");
        assert(Validator_1.default.hasValue({}), "hasValue should work for objects.");
        assert(Validator_1.default.hasValue([]), "hasValue should work for arrays.");
        assert(Validator_1.default.hasValue(function () { return; }), "hasValue should work for functions.");
        assert(Validator_1.default.hasValue(false), "hasValue should work for booleans.");
        assert(Validator_1.default.hasValue(-17), "hasValue should work for numbers.");
    });
});
