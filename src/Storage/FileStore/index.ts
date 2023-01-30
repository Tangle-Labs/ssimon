import { StorageSpec } from "../index.types";
import { IdentityConfig } from "../../identity-manager.types";
import { IFileStoreOptions } from "./index.types";
import { writeFile, readFile } from "fs/promises";
import { decryptWithAES, encryptWithAES } from "../../utils/crypto";

export class FileStorage<T extends IdentityConfig>
  implements StorageSpec<T, T>
{
  filepath: string;
  password: string;

  private constructor() {
    null;
  }

  public static async build(props: IFileStoreOptions) {
    const store = new FileStorage();
    const encrypted = encryptWithAES(JSON.stringify([]), props.password);
    await readFile(props.filepath).catch(async (err) => {
      if (!(err.code === "ENOENT")) throw new Error("unable to read file");
      writeFile(props.filepath, encrypted);
    });
    store.filepath = props.filepath;
    store.password = props.password;
    return store;
  }

  private async _getFileContents(): Promise<T[]> {
    try {
      const raw = await readFile(this.filepath);
      const decrypted = decryptWithAES(raw.toString(), this.password);
      return JSON.parse(decrypted);
    } catch {
      throw new Error("Incorrect Password");
    }
  }

  public async create(body: T): Promise<T> {
    const entities = await this._getFileContents();
    const data = [...entities, body];
    const encrypted = encryptWithAES(JSON.stringify(data), this.password);
    await writeFile(this.filepath, encrypted);
    return body;
  }

  public async findOne(options: Partial<T>): Promise<T> {
    const entities = await this._getFileContents();
    return entities.find((e) => {
      let matches = 0;
      for (const key of Object.keys(options)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (e[key] === options[key]) matches++;
      }
      return matches === Object.keys(options).length;
    });
  }

  public async findMany(options: Partial<T>): Promise<T[]> {
    const entities = await this._getFileContents();
    return entities.filter((e) => {
      let matches = 0;
      for (const key of Object.keys(options)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (e[key] === options[key]) matches++;
      }
      return matches === Object.keys(options).length;
    });
  }

  public findByIdAndDelete(id: string): Promise<T> {
    throw new Error("Method not implemented.");
  }

  public findByIdAndUpdate(id: string, body: Partial<T>): Promise<T> {
    throw new Error("Method not implemented.");
  }
}
