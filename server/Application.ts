let restify = require("restify");

import ClientFileHandler from "./handlers/ClientFileHandler";
import SendHandler from "./handlers/SendHandler";
import StatusHandler from "./handlers/StatusHandler";
import Worker from "./mailService/Worker";

/**
 * Back-end server class
 * 
 * @export Server class
 * @class Server
 */
export default class Server {
    // The typing for restify is not very good, hence we accept any type for now
    private server: any;

    constructor(private worker: Worker) {
        let options = {
            name: "Uber Code Challenge Server",
        };

        this.server = restify.createServer(options);

        this.server.use(restify.CORS());
        this.server.use(restify.fullResponse());
        this.server.use(restify.bodyParser());

        this.registerHandlers();

        this.server.listen(process.env.PORT, () => {
            console.log("%s listening at %s", this.server.name, this.server.url);
        });
    }

    private registerHandlers() {
         // Send message
        this.server.post("/api/v1/send", SendHandler);

         // Serve message sending status
        this.server.get("/api/v1/status/:uuid", StatusHandler);

        // Serves static client files
        this.server.get("/.*", ClientFileHandler);
    }
}