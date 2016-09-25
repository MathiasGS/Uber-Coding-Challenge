import Message from "../Message";

/**
 * Interface for mail service adapters.
 * 
 * @export
 * @interface IMailServiceAdapter
 */
interface IMailServiceAdapter {
    /**
     * Hands of mail to mail service.
     * 
     * @param {Message} message The message to send.
     * @returns {*} Promise of sending.
     * 
     * @memberOf IMailServiceAdapter
     */
    send(message: Message): Promise<any>;

    /**
     * Returns the probable state of the service.
     * 
     * @returns {boolean} True if service is expected to be available; otherwise false.
     * 
     * @memberOf IMailServiceAdapter
     */
    isAvailable(): boolean;
}

export default IMailServiceAdapter;
