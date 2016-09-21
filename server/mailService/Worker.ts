import Message from "../Message";
import IMailServiceAdapter from "./adapters/IMailServiceAdapter";

export default class Worker {
    constructor(private services: IMailServiceAdapter[]) {
        console.log("Worker created");
    }

    public notify(): void{
        console.log("I got notified!");
    }

    private getPending(): Message[]{
        return [];
    }

    private trySend(): any{

    }
}