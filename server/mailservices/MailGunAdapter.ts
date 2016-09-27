let request = require("request");

import Message from "../Message";
import IMailServiceAdapter from "./IMailServiceAdapter";

export default class MailGunAdapter implements IMailServiceAdapter {
    public send(message: Message): Promise<any> {
        let options = {
            auth: {
                password: process.env.MAILGUN_API_KEY,
                user: "api",
            },
            form: {
                from: message.from,
                html: message.body,
                subject: message.subject,
                to: message.to,
            },
            method: "POST",
            uri: "https://api.mailgun.net/v3/" + process.env.MAILGUN_API_USER + "/messages",
        };

        return new Promise((resolve, reject) => {
            request(options, (error: any, response: any, body: any) => {
                let parsedBody = JSON.parse(body);

                if (!error && parsedBody.id) {
                    resolve();
                } else {
                    reject(error || parsedBody.message);
                }
            });
        });
    }
}
