import Message from "../Message";

/**
 * Abstract class for data storages to extend.
 * 
 * @abstract
 * @class DataStorage
 */
abstract class DataStorage {

    /**
     * Persists the message to the data storage.
     * 
     * @abstract
     * @protected
     * @param {Message} message
     * @returns {Promise<String>}
     * 
     * @memberOf DataStorage
     */
    abstract public put(message: Message): Promise<String>;

    /**
     * Retrieves the message from the data storage.
     * 
     * @abstract
     * @protected
     * @param {String} uuid
     * @returns {Promise<Message>}
     * 
     * @memberOf DataStorage
     */
    abstract public get(uuid: String): Promise<Message>;

    /**
     * Atomically and mutually exclusively locks and retrieves a batch of pending messages.
     * 
     * @abstract
     * @protected
     * @param {String} uuid
     * @returns {Promise<Message[]>}
     * 
     * @memberOf DataStorage
     */
    abstract public retrievePending(uuid: String): Promise<Message[]>;
}

export default DataStorage;
