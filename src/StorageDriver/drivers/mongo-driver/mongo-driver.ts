import { IStorageDriver } from "../../storage-driver.interface";
import { Credential } from "@iota/identity-wasm/node";
import { IMongoDriverOptions } from "./mongo-driver.types";
import { Document } from "mongoose";

export class MongoStorageDriver
  implements IStorageDriver<Credential, Document>
{
  mongouri: `mongodb://${string}`;

  private constructor(options: IMongoDriverOptions) {
    this.mongouri = options.mongouri;
  }

  /**
   * Instantiate a new instance of FsStorageDriver
   *
   * @param {IFsDriverOpts} options - options object for FsStorageDriver
   * @returns {Promise<FsStorageDriver>}
   */

  static async newInstance(
    options: IMongoDriverOptions
  ): Promise<MongoStorageDriver> {
    const mongoDriver = new MongoStorageDriver(options);
    return mongoDriver;
  }

  /**
   * Get all of the credentials stored
   *
   * @returns {Promise<Credential[]>}
   */
  async findAll(): Promise<Credential[]> {
    return this.getFileContents();
  }

  /**
   * Find a Credential by it's ID
   *
   * @param {String} id
   * @returns {Promise<Credential[]>}
   */
  async findById(id: string): Promise<Credential> {
    const creds = await this.findAll();
    return creds.find((c) => c.id() === id);
  }

  /**
   * Filter all creds with a specific credential type
   *
   * @param {String} credType - type of the credential to look for
   * @returns {Promise<Credential[]>}
   */
  async findByCredentialType(credType: string): Promise<Credential[]> {
    const creds = await this.findAll();
    return creds.filter((c) => c.type().includes(credType));
  }

  /**
   * Filter all creds issued by a specific issuer
   *
   * @param {String} issuer
   * @returns {Promise<Credential[]>}
   */
  async findByIssuer(issuer: string): Promise<Credential[]> {
    const creds = await this.findAll();
    return creds.filter((c) => c.issuer() === issuer);
  }

  /**
   * Save a new credential to the driver
   *
   * @param {Credential} cred - credential to add to FS
   * @returns {Promise<void>}
   */
  async newCredential(cred: Credential): Promise<Credential & unknown> {
    const credentialExists = await this.findById(cred.id());
    if (credentialExists) throw new Error("credential already exists");
    const creds = await this.findAll();
    this.writeFileContents([...creds, cred]);
    return cred;
  }

  /**
   * Delete a credential by ID
   *
   * @param {String} id - id of the credential to delete
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    const creds = await this.getFileContents();
    const credsFiltered = creds.filter((c) => c.id() !== id);
    await this.writeFileContents(credsFiltered);
  }
}
