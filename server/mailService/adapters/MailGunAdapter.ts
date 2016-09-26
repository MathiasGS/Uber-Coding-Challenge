let mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: "ubercodingchallenge.azurewebsites.net"});

import Message from "../../Message";
import IMailServiceAdapter from "./IMailServiceAdapter";

export default class MailGunAdapter implements IMailServiceAdapter {
    public send(message: Message): Promise<String> {
        let options = {
            from: message.from,
            html: message.body,
            subject: message.subject,
            to: message.to,
        };

        return mailgun.messages().send(options, (error, body) => {
            if (!error) {
                console.log(body);
            } else {
                console.log(error);
            }
        });
    }

    public isAvailable(): boolean {
        return true;
    }
}
