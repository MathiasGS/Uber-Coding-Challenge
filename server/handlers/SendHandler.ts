import Message from "../Message";
import IDataStorage from "../storage/IDataStorage";

/**
 * Handles send requests. 
 * TypeScript does not support lazy evaluation of arrow functions, 
 * hence this implements similar (limited) functionality of lambda expression with lazy evaluation.
 */
export default function SendHandler(dataStorage: IDataStorage, notifyWorkers: () => void) {
    return (req: any, res: any, next: any) => {
        req.body = req.body || {};  // If no parameters are supplied, body will be undefined

        let message = new Message(req.body.from, req.body.to, req.body.subject, req.body.body);

        if (!message.isValid()) {
            res.status(400);
            res.send("Invalid input.");
            return;
        }

        return dataStorage.put(message).then(uuid => {
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
