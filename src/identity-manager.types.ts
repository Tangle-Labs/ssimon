import { IdentityAccount } from "./NetworkAdapter/IdentityAccount/index.types";
import { NetworkAdapter } from "./NetworkAdapter/index.types";
import { StorageSpec } from "./Storage/index.types";

export type IdentityConfig = {
  alias: string;
  did?: string;
  document?: Record<string, any>;
  seed?: string;
  extras?: any;
};

export type IdentityManagerOptions<T extends StorageSpec<any, any>> = {
  adapter: typeof NetworkAdapter;
  storage: T;
};

export declare class IdentityManagerSpec<T extends IdentityAccount> {
  networkAdapter: NetworkAdapter<T>;

  public static build<T extends IdentityAccount>(): Promise<
    IdentityManagerSpec<T>
  >;

  public getDid(props: {
    did?: string;
    alias?: string;
  }): Promise<IdentityAccount>;

  public createDid(...props: any[]): Promise<IdentityAccount>;
}
