let restify = require("restify");

/**
 * Handles status requests. 
 * TypeScript does not support lazy evaluation of arrow functions, 
 * hence this implements the desired functionality of lambda expression with lazy evaluation.
 */
export default function SendHandler(dataStorage: DataStorage) {
    return (req: any, res: any, next: any) => {
        dataStorage.get(req.params.uuid).then(message => {
            res.send(message);
        }, error => {
            res.status(400);
            res.send();
        });
    };
}
