import { readFile, writeFile, PathLike } from "fs";
import { IStorageDriver } from "../../storage-driver.interface";
import { Credential } from "@iota/identity-wasm/node";
import { IFsDriverOpts } from "./fs-driver.types";
import { promisify } from "util";

const fsReadFile = promisify(readFile);
const fsWriteFile = promisify(writeFile);

export class FsStorageDriver implements IStorageDriver<Credential> {
  filepath: PathLike;

  /**
   * Instantiate a new instance of FsStorageDriver
   *
   * @param {IFsDriverOpts} options - options object for FsStorageDriver
   * @returns {FsStorageDriver}
   */

  constructor(options: IFsDriverOpts) {
    this.filepath = options.filepath;
  }

  /**
   * Get the file contents of the file stored at the configured storage path
   *
   * @returns {Promise<Credential[]>}
   */
  private async getFileContents(): Promise<Credential[]> {
    const fileData = await fsReadFile(this.filepath).catch(() => {
      throw new Error("FS ERROR: Unable to read file data");
    });
    return JSON.parse(fileData.toString()).map(
      (cred: Record<string, unknown>) => Credential.fromJSON(cred)
    );
  }

  /**
   * Write the contents passed to the file configured at storage path
   *
   * @param {Credential[]} data - data to write to the file
   * @returns {Promise<void>}
   */
  private async writeFileContents(data: Credential[]): Promise<void> {
    await fsWriteFile(this.filepath, JSON.stringify(data)).catch(() => {
      throw new Error("FS ERROR: Unable to write to file");
    });
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
  async new(cred: Credential): Promise<void> {
    const creds = await this.findAll();
    this.writeFileContents([...creds, cred]);
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
    await this.writeFileContents(creds);
  }
}
