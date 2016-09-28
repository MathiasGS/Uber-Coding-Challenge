let azure = require("azure-storage");
let Promise = require("promise");
let uuid = require("uuid");

import Message from "../Message";
import DataStorage from "./DataStorage";

/**
 * Azure Data Storage (Table Storage) implementation.
 * 
 * @export
 * @class AzureDataStorage
 * @extends {DataStorage}
 */
export default class AzureDataStorage extends DataStorage {
    private static tableName = "messages";

    private tableSvc = azure.createTableService();
    private entGen = azure.TableUtilities.entityGenerator;

    constructor() {
        super();

        // Ensure table exists
        this.tableSvc.createTableIfNotExists(AzureDataStorage.tableName, (error: any) => {
            if (error) {
                throw new Error(error);
            }
        });
    }

    /**
     * Persists the message to the data storage.
     * 
     * @param {Message} message
     * @returns {Promise<String>}
     * 
     * @memberOf AzureDataStorage
     */
    public put(message: Message): Promise<String> {
        return new Promise((resolve: Function, reject: Function) => {
            let entity = this.toEntity(message);

            this.tableSvc.insertOrReplaceEntity(AzureDataStorage.tableName, entity, (error: any, result: any) => {
                if (!error) {
                    resolve(entity.RowKey._);
                } else {
                    reject(error);
                }
            });
        });
    }

    /**
     * Retrieves the message from the data storage.
     * 
     * @abstract
     * @protected
     * @param {String} uuid
     * @returns {Promise<Message>}
     * 
     * @memberOf DataStorage
     */
    public get(uuid: String): Promise<Message> {
        return new Promise((resolve: Function, reject: Function) => {
            this.tableSvc.retrieveEntity(AzureDataStorage.tableName, uuid, uuid, (error: any, result: any) => {
                if (!error) {
                    resolve(this.toMessage(result));
                } else {
                    reject(error);
                }
            });
        });
    }

    /**
     * Retrieves pending messages.
     * 
     * @param {String} uuid
     * @param {Number} batchSize
     * @returns {Promise<Promise<Message>[]>}
     * 
     * @memberOf AzureDataStorage
     */
    public retrievePending(uuid: String, batchSize: Number): Promise<Promise<Message>[]> {
        // If worker claimed message > 10 minutes ago, assume it is dead
        // Notice that this requires worker clock to be correct.
        // I am not aware of ways to use server timestamp in query.
        let query = new azure.TableQuery()
            .top(batchSize)
            .where("status == 0")
            .and("worker == ''")
            .or("status == 0")
            .and("Timestamp < datetime'" + new Date(Date.now() - 600000).toISOString() + "'");

        return new Promise((resolve: Function, reject: Function) => {
            this.tableSvc.queryEntities(AzureDataStorage.tableName, query, null, (error: any, result: any) => {
                if (!error && result.entries.length > 0) {
                    let out: Promise<Message>[] = [];
                    for (let entry of result.entries) {
                        // Azure Table Storage relies on optimistic concurrency.
                        // We attempt lock by setting worker value to provided uuid.
                        // If update is successful, we got the lock.
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
     * If entity has changed (i.e. somebody else got the lock), the request will fail.
     * 
     * @private
     * @param {*} entity
     * @param {String} uuid
     * 
     * @memberOf AzureDataStorage
     */
    private optimisticLock(entity: any): Promise<Message> {
        return new Promise((resolve: Function, reject: Function) => {
            this.tableSvc.replaceEntity(AzureDataStorage.tableName, entity, (error: any, result: any) => {
                if (error) {
                    reject();
                    return;
                }

                // Update entity with new ETag
                entity[".metadata"] = result[".metadata"];
                resolve(this.toMessage(entity));
            });
        });
    }

    /**
     * Convert Message to Azure Table Storage entity.
     * 
     * @private
     * @param {Message} message
     * @returns {*}
     * 
     * @memberOf AzureDataStorage
     */
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

    /**
     * Convert Azure Table Storage entity to Message.
     * 
     * @private
     * @param {Message} message
     * @returns {*}
     * 
     * @memberOf AzureDataStorage
     */
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
