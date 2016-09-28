let assert  = require("chai").assert;

import Validator from "../server/Validator";

describe("Validator Tests", () => {
    it("Invalid emails rejected", () => {
        assert(!Validator.isEmail(undefined), "undefined email should not be accepted.");
        assert(!Validator.isEmail(null), "null email should not be accepted.");
        assert(!Validator.isEmail(""), "Empty email should not be accepted.");
        assert(!Validator.isEmail("test"), "No @ email should not be accepted.");
        assert(!Validator.isEmail("test@"), "No domain email should not be accepted.");
        assert(!Validator.isEmail("test@domain"), "No tld email should not be accepted.");
        assert(!Validator.isEmail("test@domain.dk;test2@domain.dk"), "Multiple emails should not be accepted.");
        assert(!Validator.isEmail("test@doma in.dk"), "Email with whitespace should not be accepted.");
    });

    it("Valid emails should be accepted", () => {
        assert(Validator.isEmail("test@domain.dk"), "Basic email should be accepted.");
        assert(Validator.isEmail("test@domain.co.uk"), "Basic email with multi-dot tld should be accepted.");
    });

    it("hasValue should work for all data types", () => {
        assert(Validator.hasValue(""), "hasValue should work for strings.");
        assert(Validator.hasValue({}), "hasValue should work for objects.");
        assert(Validator.hasValue([]), "hasValue should work for arrays.");
        assert(Validator.hasValue(() => { return; }), "hasValue should work for functions.");
        assert(Validator.hasValue(false), "hasValue should work for booleans.");
        assert(Validator.hasValue(-17), "hasValue should work for numbers.");
    });
});
