import { CredentialsManager } from "../CredentialsManager/index.types";

export declare class IdentityAccount {
  credentials: CredentialsManager;

  public static async build(...props: any[]): Promise<IdentityAccount>;

  public async getDid(): Promise<string>;

  public async getDocument(): Promise<Record<string, any>>;
}
