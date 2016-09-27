let mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain: "ubercodingchallenge.azurewebsites.net" });

import Message from "../Message";
import IMailServiceAdapter from "./IMailServiceAdapter";

export default class MailGunAdapter implements IMailServiceAdapter {
    public send(message: Message): Promise<any> {
        let options = {
            from: message.from,
            html: message.body,
            subject: message.subject,
            to: message.to,
        };

        return new Promise((resolve, reject) => {
            mailgun.messages().send(options, (error) => {
                if (!error) {
                    resolve();
                } else {
                    reject(error);
                }
            });
        });
    }

    public isAvailable(): boolean {
        return true;
    }
}
