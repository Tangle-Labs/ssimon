import {
  CredentialsStorageDriverSpec,
  IStorageDriver,
} from "./CredentialsStorageDriver/index.types";

export interface IVerificationResult {
  vc: boolean;
  dvid: boolean;
}

export declare class CredentialsManager<
  T extends CredentialsStorageDriverSpec
> {
  store: T;

  public static async build(...props: any[]): Promise<CredentialsManager>;

  public isCredentialValid(...props: any[]): Promise<boolean>;

  public verify(...props: any[]): Promise<IVerificationResult>;

  public create(...props: any[]): Promise<Record<string, any>>;

  public revoke(...props: any[]): Promise<void>;
}
