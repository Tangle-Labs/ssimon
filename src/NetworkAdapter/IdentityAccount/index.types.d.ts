import { CredentialsStorageDriverSpec } from "../CredentialsManager/CredentialsStorageDriver/index.types";
import { CredentialsManager } from "../CredentialsManager/index.types";

export declare class IdentityAccount {
  credentials: CredentialsManager<
    CredentialsStorageDriverSpec<Record<string, any>, any>
  >;

  public static async build(...props: any[]): Promise<IdentityAccount>;

  public getDid(): string;

  public getDocument(): Record<string, any>;
}
