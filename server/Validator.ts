export default class Validator {
    public static isEmail(input: string): boolean {
        return /\S+@\S+\.\S+/.test(input);
    }
}
