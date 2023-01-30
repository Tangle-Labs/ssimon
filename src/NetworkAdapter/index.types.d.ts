import { IdentityAccount } from "./IdentityAccount/index.types";

export declare class NetworkAdapter<T extends IdentityAccount> {
  public static async build(): Promise<NetworkAdapter>;
  public async createDid(): Promise<T>;
  public async deserializeDid(document: Record<string, unknown>): Promise<T>;
}
