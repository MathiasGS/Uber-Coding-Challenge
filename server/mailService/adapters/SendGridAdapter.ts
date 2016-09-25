let request = require("request");

import Message from "../../Message";
import IMailServiceAdapter from "./IMailServiceAdapter";

export default class SendGridAdapter implements IMailServiceAdapter {
    public send(message: Message): Promise<String> {
        let options = {
            auth: {
                bearer: process.env.SENDGRID_API_KEY,
            },
            json: {
                content: [
                    {
                        type: "text/html",
                        value: message.body,
                    },
                ],
                from: {
                    email: message.from,
                },
                personalizations: [
                    {
                        subject: message.subject,
                        to: [
                            {
                                email: message.to,
                            },
                        ],
                    },
                ],
            },
            method: "POST",
            uri: "https://api.sendgrid.com/v3/mail/send",
        };

        return request(options, (error: any, response: any, body: any) => {
            if (!error && response.statusCode === 200) {
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
