let azure = require("azure-storage");
let Promise = require('promise');
let uuid = require("uuid");

import DataStorage from "./DataStorage";
import Message from "../Message";

export default class AzureDataStorage extends DataStorage {
    private static tableName = "messages";

    private tableSvc = azure.createTableService();
    private entGen = azure.TableUtilities.entityGenerator;

    constructor() {
        this.tableSvc.createTableIfNotExists(AzureDataStorage.tableName, (error) => {
            if (error) {
                throw new Error(error);
            }
        });
    }

    public put(message: Message): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            let entity = this.toEntity(message);

            this.tableSvc.insertOrReplaceEntity(AzureDataStorage.tableName, entity, (error, result) => {
                if (!error) {
                    resolve(entity.RowKey._);
                } else {
                    reject(error);
                }
            });
        });
    }

    public get(uuid: String): Promise<Message> {
        return new Promise<Message>((resolve, reject) => {
            this.tableSvc.retrieveEntity(AzureDataStorage.tableName, uuid, uuid, (error, result) => {
                if (!error) {
                    resolve(this.toMessage(result));
                } else {
                    reject(error);
                }
            });
        });
    }

    protected retrievePending(uuid: String): Promise<Message[]> {
        var query = new azure.TableQuery()
            .top(30)
            .where('Status eq ?', '0')
            .and('Worker eq ?', '');

        return new Promise<Message>((resolve, reject) => {
            this.tableSvc.queryEntities(AzureDataStorage.tableName, query, null, (error, result, response) => {
                if (!error) {
                    resolve(result.entries);
                } else {
                    reject(error);
                }
            });
        });
    }

    private toEntity(message: Message): Object {

        if (!message.uuid) {
            message.uuid = uuid.v1();
        }

        return {
            PartitionKey: this.entGen.String(message.sendStatus),
            RowKey: this.entGen.String(message.uuid),
            message: this.entGen.String(JSON.stringify(message)),
            worker: this.entGen.String(""),
        };
    }

    private toMessage(entity: Object): Message {
        let message = JSON.parse(entity.message._);

        return new Message(
            message.from,
            message.to,
            message.subject,
            message.body,
            message.uuid,
            message.sendStatus
        );
    }
}
