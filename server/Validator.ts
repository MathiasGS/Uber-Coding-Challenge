/**
 * Basic validator of input.
 * 
 * @export
 * @class Validator
 */
export default class Validator {
    /**
     * Validates that a string is a valid email address.
     * 
     * True validation will happen with the mail service (or the mail will not be delivered because the recipient does not exist),
     * so it is acceptable to over-approximate the set of valid adresses (but not under-approximate).
     * 
     * ; should be disallowed 
     * 
     * @static
     * @param {String} input
     * @returns {Boolean}
     * 
     * @memberOf Validator
     */
    public static isEmail(input: String): Boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(<string> input);
    }

    /**
     * Validates that the input has value, i.e. is not null or undefined.
     * 
     * @static
     * @param {*} input
     * @returns {Boolean}
     * 
     * @memberOf Validator
     */
    public static hasValue(input: any): Boolean {
        return input !== undefined && input !== null;
    }
}
