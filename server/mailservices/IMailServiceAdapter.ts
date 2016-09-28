import Message from "../Message";

/**
 * Interface for mail service adapters.
 * 
 * @export
 * @interface IMailServiceAdapter
 */
interface IMailServiceAdapter {
    /**
     * Hands off mail to mail service.
     * 
     * @param {Message} message
     * @returns {Promise<any>}
     * 
     * @memberOf IMailServiceAdapter
     */
    send(message: Message): Promise<any>;
}

export default IMailServiceAdapter;
