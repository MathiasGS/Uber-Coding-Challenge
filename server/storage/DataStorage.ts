import Message from "../Message";

export default class DataStorage {

    private static instance: DataStorage = new DataStorage();

    public static getInstance() {
        return DataStorage.instance;
    }

    constructor() {
        if (DataStorage.instance) {
            throw Error("Singleton: use getInstance() instead of new.");
        }
    }

    public put(message: Message): Promise<String> {
        console.log("Database put");
        return new Promise<String>(() => resolve("uuid"));
    }

    public get(uuid: String): Promise<Message> {
        return new Promise<Message>(() => new Message("", "", "", ""));
    }
}