import SendStatus from "./SendStatus";
import Validator from "./Validator";

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
        public sendStatus: SendStatus = SendStatus.Pending) {

        };

    /**
     * Validates if the message properties are valid.
     * Subject and body are optional.
     * 
     * @returns {Boolean}
     * 
     * @memberOf Message
     */
    public isValid(): Boolean {
        return Validator.isEmail(this.from) &&
            Validator.isEmail(this.to) &&
            Validator.hasValue(this.subject) &&
            Validator.hasValue(this.body);
    }
}
