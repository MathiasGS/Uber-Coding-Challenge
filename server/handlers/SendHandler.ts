let restify = require("restify");

/**
 * Handler for client files. Serves static files.
 */
export default function SendHandler(req: any, res: any, next: any) {
    res.send({
        service: "SendGrid",
        timestamp: "datetime",
        uuid: "uuid",
    });
}
