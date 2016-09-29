import Message from "../Message";

/**
 *  Interface for data storages to implement.
 * 
 * 
 * @interface IDataStorage
 */
interface IDataStorage {

    /**
     * Persists the message to the data storage.
     * 
     * @param {Message} message
     * @returns {Promise<String>} Promise of message uuid
     * 
     * @memberOf IDataStorage
     */
    put(message: Message): Promise<String>;

    /**
     * Retrieves the message from the data storage.
     * 
     * @param {String} uuid
     * @returns {Promise<Message>}
     * 
     * @memberOf IDataStorage
     */
    get(uuid: String): Promise<Message>;

    /**
     * Atomically and mutually exclusively locks and retrieves a batch of pending messages for the uuid.
     * 
     * @param {String} uuid
     * @param {Number} batchSize
     * @returns {Promise<Promise<Message>[]>}
     * 
     * @memberOf IDataStorage
     */
    retrievePending(uuid: String, batchSize: Number): Promise<Promise<Message>[]>;
}

export default IDataStorage;
