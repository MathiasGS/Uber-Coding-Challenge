"use strict";
var restify = require("restify");
var ClientFileHandler_1 = require("./handlers/ClientFileHandler");
var SendHandler_1 = require("./handlers/SendHandler");
var StatusHandler_1 = require("./handlers/StatusHandler");
var Server = (function () {
    function Server(worker) {
        var _this = this;
        this.worker = worker;
        var options = {
            name: "Uber Code Challenge Server",
        };
        this.server = restify.createServer(options);
        this.server.use(restify.CORS());
        this.server.use(restify.fullResponse());
        this.server.use(restify.bodyParser());
        this.registerHandlers();
        this.server.listen(process.env.PORT, function () {
            console.log("%s listening at %s", _this.server.name, _this.server.url);
        });
    }
    Server.prototype.registerHandlers = function () {
        this.server.post("/api/v1/send", SendHandler_1.default);
        this.server.get("/api/v1/status/:uuid", StatusHandler_1.default);
        this.server.get("/.*", ClientFileHandler_1.default);
    };
    return Server;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Server;
//# sourceMappingURL=Application.js.map