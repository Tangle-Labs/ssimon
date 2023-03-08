import { readFile, writeFile, PathLike } from "fs";
import { promisify } from "util";
import { CredentialsStorageDriverSpec } from "../../CredentialsManager/CredentialsStorageDriver/index.types";

const fsReadFile = promisify(readFile);
const fsWriteFile = promisify(writeFile);

export class FsStorageDriver implements CredentialsStorageDriverSpec<any, any> {
  filepath: PathLike;

  constructor(options: { filepath: string }) {
    this.filepath = options.filepath;
    FsStorageDriver.instantiateFile(options);
  }

  /**
   * Creates a file if it doesn't exist
   *
   * @returns {Promise<void>}
   */
  private static async instantiateFile(options: {
    filepath: string;
  }): Promise<void> {
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
   * @returns {Promise<Record<string, any>[]>}
   */
  private async getFileContents(): Promise<any[]> {
    const fileData = await fsReadFile(this.filepath).catch(() => {
      throw new Error("FS ERROR: Unable to read file data");
    });

    return fileData.toString() !== "" ? JSON.parse(fileData.toString()) : [];
  }

  /**
   * Write the contents passed to the file configured at storage path
   *
   * @param {Record<string, any>[]} data - data to write to the file
   * @returns {Promise<void>}
   */
  private async writeFileContents(data: any[]): Promise<void> {
    await fsWriteFile(this.filepath, JSON.stringify(data)).catch(() => {
      throw new Error("FS ERROR: Unable to write to file");
    });
  }

  /**
   * Get all of the credentials stored
   *
   * @returns {Promise<Record<string, any>[]>}
   */
  async findAll(): Promise<Record<string, any>[]> {
    return await this.getFileContents();
  }

  /**
   * Find a Credential by it's ID
   *
   * @param {String} id
   * @returns {Promise<Record<string, any>>}
   */
  async findById(id: string): Promise<Record<string, any>> {
    const creds = await this.getFileContents();
    const cred = creds.find((c) => c.id === id);
    if (!cred) throw new Error("Credential not found");
    return cred;
  }

  /**
   * Filter all creds with a specific credential type
   *
   * @param {String} credType - type of the credential to look for
   * @returns {Promise<Record<string, any>[]>}
   */
  async findByCredentialType(credType: string): Promise<Record<string, any>[]> {
    const creds = await this.getFileContents();
    return creds.filter((c) => c.type.includes(credType));
  }

  /**
   * Filter all creds issued by a specific issuer
   *
   * @param {String} issuer
   * @returns {Promise<Record<string, any>[]>}
   */
  async findByIssuer(issuer: string): Promise<Record<string, any>[]> {
    const creds = await this.getFileContents();
    return creds.filter((c) => c.issuer === issuer);
  }

  /**
   * Save a new credential to the driver
   *
   * @param {Record<string, any>} cred - credential to add to FS
   * @returns {Promise<void>}
   */
  async newCredential(cred: Record<string, any>): Promise<any> {
    const storedCredentials = await this.getFileContents();
    const credentialExists = storedCredentials.find((c) => c.id === cred.id);
    if (credentialExists) throw new Error("credential already exists");
    const creds = await this.getFileContents();
    const storedCred = {
      id: cred.id,
      type: cred.type,
      issuer: cred.issuer,
      credential: cred,
    };
    this.writeFileContents([...creds, storedCred]);
    return storedCred;
  }

  /**
   * Delete a credential by ID
   *
   * @param {String} id - id of the credential to delete
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    const creds = await this.getFileContents();
    const credsFiltered = creds.filter((c) => c.id !== id);
    await this.writeFileContents(credsFiltered);
  }

  /**
   * Cleanup
   */
  async cleanup() {
    return;
  }
}
