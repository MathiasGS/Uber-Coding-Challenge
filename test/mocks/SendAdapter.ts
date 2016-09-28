import Message from "../../server/Message";
import IMailServiceAdapter from "../../server/mailservices/IMailServiceAdapter";

export default class MockMailServiceAdapter implements IMailServiceAdapter {
    constructor(private sendHandler = (message: Message, resolve, reject) => resolve(message.uuid)) {

    }


    public send(message: Message): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            this.sendHandler(message, resolve, reject);
        });
    }

    public isAvailable(): boolean {
        return true;
    }
}
