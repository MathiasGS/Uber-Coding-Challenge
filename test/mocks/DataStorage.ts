let Promise = require("promise");

import Message from "../../server/Message";
import IDataStorage from "../../server/storage/IDataStorage";

/**
 * Data storage mock. Handlers can be customized as needed during tests.
 * 
 * @export
 * @class MockDataStorage
 * @implements {IDataStorage}
 */
export default class MockDataStorage implements IDataStorage {
    // Logs put requests
    public putInput: Message[] = [];

    // Logs get requests
    public getInput: String[] = [];

    // Logs retrieve input requests
    public retrievePendingInput: String[] = [];

    // Will be returned by the default retrievePendingHandler
    public pendingMessages: Message[] = [];

    // Default handlers
    // Too complex to customize during instantiation
    public putHandler = (message: Message, resolve: (uuid: String) => void, reject: (error: any) => void) => resolve(message.uuid);
    public getHandler = (uuid: String, resolve: (message: Message) => void, reject: (error: any) => void) => resolve(new Message("", "", "", ""));
    public retrievePendingHandler = (uuid: String, resolve: (promises: Promise<Message>[]) => void, reject: (error: any) => void) => {
        resolve(this.pendingMessages.map(message => new Promise((resolve: any) => resolve(message))));
    }

    public put(message: Message): Promise<String> {
        this.putInput.push(message);

        return new Promise((resolve: (uuid: String) => void, reject: (error: any) => void) => {
            this.putHandler(message, resolve, reject);
        });
    }

    public get(uuid: String): Promise<Message> {
        this.getInput.push(uuid);

        return new Promise((resolve: (message: Message) => void, reject: (error: any) => void) => {
            this.getHandler(uuid, resolve, reject);
        });
    }

    public retrievePending(uuid: String, batchSize: Number): Promise<Promise<Message>[]> {
        this.retrievePendingInput.push(uuid);

        return new Promise((resolve: (promises: Promise<Message>[]) => void, reject: (error: any) => void) => {
            this.retrievePendingHandler(uuid, resolve, reject);
        });
    }
}
