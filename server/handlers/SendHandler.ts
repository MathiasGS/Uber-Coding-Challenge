import MailServiceAdapter from "../mailService/adapters/SendGridAdapter";
import Message from "../Message";
import DataStorage from "../storage/DataStorage";

/**
 * Handles send requests.
 */
export default function SendHandler(req: any, res: any, next: any) {
    let message = new Message(req.body.from, req.body.to, req.body.subject, req.body.body);

    if (!message.isValid()) {
        console.log("Message is not valid.")
        res.status(400);
        res.send("Invalid input.");
        next();
    }

    console.log("Attempting send");
        let adapter = new MailServiceAdapter();
        adapter.send(message);
        console.log("Attempt completed");

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
