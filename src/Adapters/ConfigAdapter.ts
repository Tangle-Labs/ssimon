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
    return JSON.parse((await readFile(this.identityPath)).toString());
  }

  async saveIdentityConfig(identity: IdentityConfig): Promise<IdentityConfig> {
    const identities = await this.getIdentityConfig();
    await writeFile(
      this.identityPath,
      JSON.stringify([...identities, identity])
    );
    console.log(this.getIdentityConfig, identity);
    return identity;
  }
}
