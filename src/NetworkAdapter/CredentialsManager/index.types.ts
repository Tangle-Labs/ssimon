import { CredentialsStorageDriverSpec } from "./CredentialsStorageDriver/index.types";

export interface IVerificationResult {
  vc: boolean;
  dvid: boolean;
}

export type CreateCredentialProps = {
  id: string;
  recipientDid: string;
  body: Record<string, unknown>;
  type: string | string[];
  keyIndex: number;
};

export declare class CredentialsManager<
  T extends CredentialsStorageDriverSpec<Record<string, any>, any>
> {
  store: T;

  public static build<T extends CredentialsStorageDriverSpec<any, any>>(
    ...props: any[]
  ): Promise<CredentialsManager<T>>;

  public isCredentialValid(
    credential: Record<string, unknown>
  ): Promise<boolean>;

  public verify(
    credential: Record<string, unknown>
  ): Promise<IVerificationResult>;

  public create(options: CreateCredentialProps): Promise<Record<string, any>>;

  public revoke(keyIndex: number): Promise<void>;
}
