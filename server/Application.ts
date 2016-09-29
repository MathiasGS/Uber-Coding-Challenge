let restify = require("restify");

import ClientFileHandler from "./handlers/ClientFileHandler";
import SendHandler from "./handlers/SendHandler";
import StatusHandler from "./handlers/StatusHandler";
import IDataStorage from "./storage/IDataStorage";

/**
 * Backend server class
 * 
 * @export Server class
 * @class Server
 */
export default class Server {
    private server: any;

    /**
     * Creates an instance of Server.
     * 
     * @param {DataStorage} dataStorage
     * @param {() => void} notifyWorkers Function to notify workers of pending work.
     * 
     * @memberOf Server
     */
    constructor(private dataStorage: IDataStorage, private notifyWorkers: () => void) {
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

    /**
     * Registers backend API endpoint handlers and client file request handlers.
     * 
     * @private
     * 
     * @memberOf Server
     */
    private registerHandlers() {
         // Send message
        this.server.post("/api/v1/send", SendHandler(this.dataStorage, this.notifyWorkers));

         // Serve message sending status
        this.server.get("/api/v1/status/:uuid", StatusHandler(this.dataStorage));

        // Serves static client files
        this.server.get("/.*", ClientFileHandler);
    }
}