import Message from "../Message";
import DataStorage from "../storage/DataStorage";

/**
 * Handler for client files. Serves static files.
 */
export default function SendHandler(req: any, res: any, next: any) {
    let message = new Message(req.body.from, req.body.to, req.body.subject, req.body.body);

    console.log(JSON.stringify(message));

    DataStorage.getInstance().put(message).then(uuid => {
        console.log("Promise resolved");
        res.send({
            uuid: "uuid",
        });
    }, () => {
        res.status(400);
        res.send();
    });
}
