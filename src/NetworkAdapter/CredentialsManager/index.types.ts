import { CredentialsStorageDriverSpec } from "./CredentialsStorageDriver/index.types";

export interface IVerificationResult {
  vc: boolean;
  dvid: boolean;
}

export declare class CredentialsManager<
  T extends CredentialsStorageDriverSpec<Record<string, any>, any>
> {
  store: T;

  public static build<T extends CredentialsStorageDriverSpec<any, any>>(
    ...props: any[]
  ): Promise<CredentialsManager<T>>;

  public isCredentialValid(...props: any[]): Promise<boolean>;

  public verify(...props: any[]): Promise<IVerificationResult>;

  public create(...props: any[]): Promise<Record<string, any>>;

  public revoke(...props: any[]): Promise<void>;
}
