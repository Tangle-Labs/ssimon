import { IdentityAccount } from "./NetworkAdapter/IdentityAccount/index.types";
import { NetworkAdapter } from "./NetworkAdapter/index.types";

export type IdentityConfig = {
  alias: string;
  did: string;
  document: Record<string, any>;
  store: Record<string, any>;
};

export type IdentityManagerOptions = {
  adapter: typeof NetworkAdapter;
};

export declare class IdentityManagerSpec {
  networkAdapter: NetworkAdapter;

  public static async build(): Promise<IdentityManager>;

  public getDid(props: Record<string, unknown>): Promise<IdentityAccount>;

  public createDid(...props: any[]): Promise<IdentityAccount>;
}
