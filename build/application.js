var restify = require("restify");
var ClientFileHandler_1 = require('./handlers/ClientFileHandler');
var Server = (function () {
    function Server() {
        var _this = this;
        var options = {
            name: 'Uber Code Challenge Server'
        };
        this.server = restify.createServer(options);
        this.server.use(restify.CORS());
        this.server.use(restify.fullResponse());
        this.server.use(restify.queryParser());
        this.registerHandlers();
        this.server.listen(80, function () {
            console.log('%s listening at %s', _this.server.name, _this.server.url);
        });
    }
    Server.prototype.registerHandlers = function () {
        this.server.get("/(.*)?", ClientFileHandler_1.default);
    };
    return Server;
})();
exports.Server = Server;
//# sourceMappingURL=Application.js.map