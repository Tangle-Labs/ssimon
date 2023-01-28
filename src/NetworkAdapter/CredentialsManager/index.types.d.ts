import { StorageDriver } from "../../StorageDriver/drivers/storage-driver.types";

export interface IVerificationResult {
  vc: boolean;
  dvid: boolean;
}

export declare class CredentialsManager {
  store: StorageDriver;

  public static async build(...props: any[]): Promise<CredentialsManager>;

  public isCredentialValid(...props: any[]): Promise<boolean>;

  public verify(...props: any[]): Promise<IVerificationResult>;

  public create(...props: any[]): Promise<Record<string, any>>;

  public revoke(...props: any[]): Promise<void>;
}
