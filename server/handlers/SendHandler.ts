import Message from "../Message";
import DataStorage from "../storage/DataStorage";

/**
 * Handles send requests. 
 * TypeScript does not support lazy evaluation of arrow functions, 
 * hence this implements the desired functionality of lambda expression with lazy evaluation.
 */
export default function SendHandler(dataStorage: DataStorage, notifyWorkers: () => void) {
    return (req: any, res: any, next: any) => {
        let message = new Message(req.body.from, req.body.to, req.body.subject, req.body.body);

        if (!message.isValid()) {
            console.log("Message is not valid.");
            res.status(400);
            res.send("Invalid input.");
        }

        dataStorage.put(message).then(uuid => {
            notifyWorkers();
            res.send({
                uuid: uuid,
            });
        }, error => {
            res.status(400);
            res.send();
        });
    };
}
