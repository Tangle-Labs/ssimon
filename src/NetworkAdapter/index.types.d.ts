import { IdentityAccount } from "./IdentityAccount/index.types";

export declare class NetworkAdapter<T extends IdentityAccount> {
  public static async build(): Promise<NetworkAdapter>;
  public async createDid(...props: any[]): Promise<T>;
  public async getDid(...props: any[]): Promise<T>;
}
