import SendStatus from "./SendStatus";

/**
 * Class to represent a message.
 * 
 * @export
 * @class Message
 */
export default class Message {
    constructor(
        public from: String,
        public to: String,
        public subject: String,
        public body: String,
        public uuid?: String,
        public sendStatus?: SendStatus = SendStatus.Pending) {

        };

    /**
     * Validates if the message properties are valid.
     * 
     * @returns {Boolean}
     * 
     * @memberOf Message
     */
    public isValid(): Boolean {
        return true;
    }
}
