import Server from "./Application";
import SendGridAdapter from "./mailService/adapters/SendGridAdapter";
import Worker from "./mailService/Worker";

const worker = new Worker([
    new SendGridAdapter(),
]);

const app = new Server(worker);
