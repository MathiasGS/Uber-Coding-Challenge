import Message from "../Message";

/**
 * Abstract class for data storages to extend.
 * Abstract class used rather than interface to encourage sharing of common functionality.
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
     * @returns {Promise<String>} Promise of uuid.
     * 
     * @memberOf DataStorage
     */
    public abstract put(message: Message): Promise<String>;

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
    public abstract get(uuid: String): Promise<Message>;

    /**
     * Atomically and mutually exclusively locks and retrieves a batch of pending messages for the uuid.
     * 
     * @abstract
     * @param {String} uuid
     * @param {Number} batchSize
     * @returns {Promise<Promise<Message>[]>}
     * 
     * @memberOf DataStorage
     */
    public abstract retrievePending(uuid: String, batchSize: Number): Promise<Promise<Message>[]>;
}

export default DataStorage;
