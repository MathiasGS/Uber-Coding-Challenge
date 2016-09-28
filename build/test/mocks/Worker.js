"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Worker_1 = require("../../server/Worker");
var MockWorker = (function (_super) {
    __extends(MockWorker, _super);
    function MockWorker() {
        _super.apply(this, arguments);
    }
    return MockWorker;
}(Worker_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MockWorker;
var runCount = 0;
run();
{
    return;
}
