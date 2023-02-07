import { IdentityConfig } from "../identity-manager.types";
import { CredentialsStorageDriverSpec } from "./CredentialsManager/CredentialsStorageDriver/index.types";
import { IdentityAccount } from "./IdentityAccount/index.types";

export type DidCreationResult = {
  identity: IdentityAccount;
  seed: string;
};

export type CreateDidProps<
  T extends CredentialsStorageDriverSpec<Record<string, any>, any>
> = {
  seed?: string;
  alias: string;
  store: T;
};

export declare class NetworkAdapter<T extends IdentityAccount> {
  public static build<T extends IdentityAccount>(): Promise<NetworkAdapter<T>>;
  public createDid<
    T extends CredentialsStorageDriverSpec<Record<string, any>, any>
  >(props: CreateDidProps<T>): Promise<DidCreationResult>;
  public deserializeDid<
    T extends CredentialsStorageDriverSpec<Record<string, any>, any>
  >(conf: IdentityConfig, store: T): Promise<DidCreationResult>;
}
