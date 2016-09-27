let azure = require("azure-storage");
let Promise = require("promise");
let uuid = require("uuid");

import DataStorage from "./DataStorage";
import Message from "../Message";

export default class AzureDataStorage extends DataStorage {
    private static tableName = "messages";

    private tableSvc = azure.createTableService();
    private entGen = azure.TableUtilities.entityGenerator;

    constructor() {
        super();
        this.tableSvc.createTableIfNotExists(AzureDataStorage.tableName, (error) => {
            if (error) {
                throw new Error(error);
            }
        });
    }

    public put(message: Message): Promise<String> {
        return new Promise((resolve: Function, reject: Function) => {
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
        return new Promise((resolve: Function, reject: Function) => {
            this.tableSvc.retrieveEntity(AzureDataStorage.tableName, uuid, uuid, (error, result) => {
                if (!error) {
                    resolve(this.toMessage(result));
                } else {
                    reject(error);
                }
            });
        });
    }

    public retrievePending(uuid: String): Promise<Promise<Message>[]> {
        // If worker claimed message > 10 minutes ago, assume it is dead
        let query = new azure.TableQuery()
            .top(30)
            .where("status == 0")
            .and("worker == ''")
            .or("status == 0")
            .and("Timestamp < datetime'" + new Date(Date.now() - 600000).toISOString() + "'");

        return new Promise((resolve: Function, reject: Function) => {
            this.tableSvc.queryEntities(AzureDataStorage.tableName, query, null, (error, result) => {
                if (!error && result.entries.length > 0) {
                    let out: Promise<Message>[] = [];
                    for (let entry of result.entries) {
                        entry.worker._ = uuid;
                        out.push(this.optimisticLock(entry));
                    }
                    resolve(out);
                } else {
                    reject(error);
                }
            });
        });
    }

    /**
     * Locks entity using optimistic concurrency.
     * Entity ETag is automatically used to assert that the entity has not changed.
     * If entity has changed, the request will fail.
     * 
     * @private
     * @param {*} entity
     * @param {String} uuid
     * 
     * @memberOf AzureDataStorage
     */
    private optimisticLock(entity: any): Promise<Message> {
        return new Promise((resolve: Function, reject: Function) => {
            this.tableSvc.replaceEntity(AzureDataStorage.tableName, entity, (error, result) => {
                if (error) {
                    reject();
                    return;
                }

                entity[".metadata"] = result[".metadata"];
                resolve(this.toMessage(entity));
            });
        });
    }

    private toEntity(message: Message): any {
        if (!message.uuid) {
            message.uuid = uuid.v1();
        }

        return {
            PartitionKey: this.entGen.String(message.uuid),
            RowKey: this.entGen.String(message.uuid),
            message: this.entGen.String(JSON.stringify(message)),
            status: this.entGen.Int32(message.sendStatus),
            worker: this.entGen.String(""),
        };
    }

    private toMessage(entity: any): Message {
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
