"use strict";
var Validator = (function () {
    function Validator() {
    }
    Validator.isEmail = function (input) {
        return /[^\s@]+@[^\s@]+\.[^\s;@]+/.test(input);
    };
    Validator.hasValue = function (input) {
        return input !== undefined && input !== null;
    };
    return Validator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Validator;
