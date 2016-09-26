let Promise = require("promise");

import DataStorage from "../../server/storage/DataStorage";
import Message from "../../server/Message";

export default class MockDataStorage extends DataStorage {
    public putInput = [];
    public getInput = [];

    constructor(private putHandler = (message, resolve, reject) => resolve(message.uuid),
                private getHandler = (resolve, reject) => resolve(new Message("", "", "", ""))) {

    }

    public put(message: Message): Promise<String> {
        this.putInput.push(message);

        return new Promise<String>((resolve, reject) => {
            this.putHandler(message, resolve, reject);
        });
    }

    public get(uuid: String): Promise<Message> {
        this.getInput.push(message);

        return new Promise<Message>((resolve, reject) => {
            this.getHandler(uuid, resolve, reject);
        });
    }

    public retrievePending(uuid: String): Promise<Message[]> {
        return new Promise<Message[]>((resolve, reject) => resolve([]));
    }
}
