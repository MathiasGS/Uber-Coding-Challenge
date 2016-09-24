let restify = require("restify");

/**
 * Handler for client files. Serves static files.
 */
export default function StatusHandler(req: any, res: any, next: any) {
    res.send({
        status: "pending",
        timestamp: Date.now(),
    });
}
