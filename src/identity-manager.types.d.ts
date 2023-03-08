import { CredentialsStorageDriverSpec } from "./NetworkAdapter/CredentialsManager/CredentialsStorageDriver/index.types";
import { IdentityAccount } from "./NetworkAdapter/IdentityAccount/index.types";
import { NetworkAdapter, StoreOptions } from "./NetworkAdapter/index.types";
import { StorageSpec } from "./Storage/index.types";

export type IdentityConfig = {
  alias: string;
  did?: string;
  document?: Record<string, any>;
  seed?: string;
  extras?: any;
};

export type IdentityManagerOptions<T extends StorageSpec> = {
  adapter: typeof NetworkAdapter;
  password: string;
  storage: {
    store: typeof T;
    props: any;
  };
};

export declare class IdentityManagerSpec {
  networkAdapter: NetworkAdapter;

  public static async build(): Promise<IdentityManager>;

  public getDid(props: {
    did?: string;
    alias?: string;
  }): Promise<IdentityAccount>;

  public createDid(...props: any[]): Promise<IdentityAccount>;
}
