import { IdentityConfig } from "../identity-manager.types";
import * as path from "path";
import { writeFile, readFile } from "fs/promises";

export class ConfigAdapter {
  identityPath: string;

  constructor(filepath: string, managerAlias: string) {
    this.identityPath = path.resolve(
      __dirname,
      filepath,
      `${managerAlias}-config.json`
    );
  }

  async getIdentityConfig(): Promise<IdentityConfig[]> {
    const rawFileContent = await readFile(this.identityPath).catch((e) => {
      if (e.code === "ENOENT") return Buffer.from("[]");
    });
    return JSON.parse(rawFileContent.toString());
  }

  async saveIdentityConfig(identity: IdentityConfig): Promise<IdentityConfig> {
    const identities = await this.getIdentityConfig();
    await writeFile(
      this.identityPath,
      JSON.stringify([...identities, identity])
    );
    return identity;
  }
}
