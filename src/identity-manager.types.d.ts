import { IdentityAccount } from "./NetworkAdapter/IdentityAccount/index.types";
import { NetworkAdapter } from "./NetworkAdapter/index.types";
import { StorageSpec } from "./Storage/index.types";

export type IdentityConfig = {
  alias: string;
  did: string;
  document: Record<string, any>;
  store: Record<string, any>;
  seed: string;
};

export type IdentityManagerOptions<T extends StorageSpec> = {
  adapter: typeof NetworkAdapter;
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
