"use strict";
var Validator = (function () {
    function Validator() {
    }
    Validator.isEmail = function (input) {
        return /\S+@\S+\.\S+/.test(input);
    };
    return Validator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Validator;
