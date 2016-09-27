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
}

export default IMailServiceAdapter;
