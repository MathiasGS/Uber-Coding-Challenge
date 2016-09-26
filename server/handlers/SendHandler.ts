import MailServiceAdapter from "../mailService/adapters/MailGunAdapter";
import Message from "../Message";
import DataStorage from "../storage/DataStorage";
import Worker from "../Worker";

/**
 * Handles send requests. 
 * TypeScript does not support lazy evaluation of arrow functions, 
 * hence this implements the desired functionality of lambda expression with lazy evaluation.
 */
export default function SendHandler(dataStorage: DataStorage, workers: Worker[]) {
    return (req: any, res: any, next: any) => {
        let message = new Message(req.body.from, req.body.to, req.body.subject, req.body.body);

        if (!message.isValid()) {
            console.log("Message is not valid.");
            res.status(400);
            res.send("Invalid input.");
        }

        let adapter = new MailServiceAdapter();
        adapter.send(message);

        dataStorage.put(message).then(uuid => {
            res.send({
                uuid: uuid,
            });
        }, error => {
            res.status(400);
            res.send();
        });
    };
}
