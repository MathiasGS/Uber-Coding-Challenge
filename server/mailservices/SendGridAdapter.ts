let request = require("request");

import Message from "../Message";
import IMailServiceAdapter from "./IMailServiceAdapter";

/**
 * SendGrid mail sending adapter.
 * 
 * @export
 * @class SendGridAdapter
 * @implements {IMailServiceAdapter}
 */
export default class SendGridAdapter implements IMailServiceAdapter {
    /**
     * Hands off mails to SendGrid.
     * 
     * @param {Message} message
     * @returns {Promise<any>}
     * 
     * @memberOf SendGridAdapter
     */
    public send(message: Message): Promise<any> {
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

        return new Promise((resolve, reject) => {
            request(options, (error: any, response: any) => {
                if (!error && response.statusCode === 202) {
                    resolve();
                } else {
                    reject(error);
                }
            });
        });
    }
}
