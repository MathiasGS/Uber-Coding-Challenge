export default class Message {
    constructor(
        public from: String,
        public to: String,
        public subject: String,
        public body: String,
        public uuid?: String) {

        };

    public isValid(): Boolean {
        return true;
    }
}
