import { IdentityConfig } from "../identity-manager.types";
import { IdentityAccount } from "./IdentityAccount/index.types";

export type DidCreationResult = {
  identity: IdentityAccount;
  seed: string;
};

export declare class NetworkAdapter<T extends IdentityAccount> {
  public static async build(): Promise<NetworkAdapter>;
  public async createDid(seed?: string): Promise<DidCreationResult>;
  public async deserializeDid(conf: IdentityConfig): Promise<DidCreationResult>;
}
