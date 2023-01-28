import {
  IdentityManagerOptions,
  IdentityManagerSpec,
} from "./identity-manager.types";
import { IdentityAccount } from "./NetworkAdapter/IdentityAccount/index.types";
import { NetworkAdapter } from "./NetworkAdapter/index.types";

export class IdentityManager<T extends IdentityAccount>
  implements IdentityManagerSpec
{
  networkAdapter: NetworkAdapter<T>;

  public static async build(options: IdentityManagerOptions) {
    const manager = new IdentityManager();
    manager.networkAdapter = await options.adapter.build();
    return manager;
  }

  public getDid(props: Record<string, unknown>): Promise<IdentityAccount> {
    return this.networkAdapter.getDid(props);
  }
  public createDid(...props: any[]): Promise<IdentityAccount> {
    return this.networkAdapter.createDid();
  }
}
