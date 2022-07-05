import { readFile, writeFile, PathLike } from "fs";
import { IStorageDriver } from "../../storage-driver.interface";
import { Credential } from "@iota/identity-wasm/node";
import { IFsDriverOpts } from "./fs-driver.types";
import { promisify } from "util";

const fsReadFile = promisify(readFile);
const fsWriteFile = promisify(writeFile);

export class FsStorageDriver implements IStorageDriver<Credential, unknown> {
  filepath: PathLike;

  private constructor(options: IFsDriverOpts) {
    this.filepath = options.filepath;
  }

  /**
   * Instantiate a new instance of FsStorageDriver
   *
   * @param {IFsDriverOpts} options - options object for FsStorageDriver
   * @returns {Promise<FsStorageDriver>}
   */

  static async newInstance(options: IFsDriverOpts): Promise<FsStorageDriver> {
    const fsDriver = new FsStorageDriver(options);
    await this.instantiateFile(options);
    return fsDriver;
  }

  /**
   * Creates a file if it doesn't exist
   *
   * @returns {Promise<void>}
   */
  private static async instantiateFile(options: IFsDriverOpts): Promise<void> {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const fileData = await fsReadFile(options.filepath).catch((error: any) => {
      if (error.code !== "ENOENT") throw new Error(error);
    });
    if (fileData) return;
    await fsWriteFile(options.filepath, JSON.stringify([])).catch(() => {
      throw new Error("FS ERROR: Unable to write to file");
    });
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
