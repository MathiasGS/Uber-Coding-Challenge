import Message from "../../Message";
import IMailServiceAdapter from "./IMailServiceAdapter";

export default class SendGridAdapter implements IMailServiceAdapter {
    public send(message: Message): any {
        return console.log("sending message");
    }

    public isAvailable(): boolean {
        return true;
    }
}
