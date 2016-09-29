import IMailServiceAdapter from "../../server/mailservices/IMailServiceAdapter";
import Message from "../../server/Message";

/**
 * Mail service adapter mock. Handlers can be customized as needed during tests.
 * 
 * @export
 * @class MockMailServiceAdapter
 * @implements {IMailServiceAdapter}
 */
export default class MockMailServiceAdapter implements IMailServiceAdapter {
    constructor(public sendHandler = (message: Message, resolve, reject) => resolve(message.uuid)) {

    }

    public send(message: Message): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            this.sendHandler(message, resolve, reject);
        });
    }
}
