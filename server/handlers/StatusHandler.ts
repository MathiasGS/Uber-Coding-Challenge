let restify = require("restify");

import Message from "../Message";
import IDataStorage from "../storage/IDataStorage";

/**
 * Handles status requests. 
 * TypeScript does not support lazy evaluation of arrow functions, 
 * hence this implements similar (limited) functionality of lambda expression with lazy evaluation.
 */
export default function SendHandler(dataStorage: IDataStorage) {
    return (req: any, res: any, next: any) => {
        dataStorage.get(req.params.uuid).then((message: Message) => {
            res.send(message);
        }, error => {
            res.status(400);
            res.send();
        });
    };
}
