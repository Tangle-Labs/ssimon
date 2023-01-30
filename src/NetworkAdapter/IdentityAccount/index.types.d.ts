import { CredentialsManager } from "../CredentialsManager/index.types";

export declare class IdentityAccount {
  credentials: CredentialsManager;

  public static async build(...props: any[]): Promise<IdentityAccount>;

  public getDid(): string;

  public getDocument(): Record<string, any>;
}
