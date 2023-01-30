import {
  IdentityConfig,
  IdentityManagerOptions,
  IdentityManagerSpec,
} from "./identity-manager.types";
import { IdentityAccount } from "./NetworkAdapter/IdentityAccount/index.types";
import { NetworkAdapter } from "./NetworkAdapter/index.types";
import { StorageSpec } from "./Storage/index.types";

export class IdentityManager<T extends IdentityAccount>
  implements IdentityManagerSpec
{
  networkAdapter: NetworkAdapter<T>;
  storage: StorageSpec<IdentityConfig, IdentityConfig>;

  public static async build(
    options: IdentityManagerOptions<StorageSpec<any, any>>
  ) {
    const { adapter, storage } = options;
    const manager = new IdentityManager();
    manager.networkAdapter = await adapter.build();
    manager.storage = await storage.store.build(storage.props);
    return manager;
  }

  public getDid(document: Record<string, unknown>): Promise<IdentityAccount> {
    return this.networkAdapter.deserializeDid(document);
  }

  public async createDid(...props: any[]): Promise<IdentityAccount> {
    const { identity } = await this.networkAdapter.createDid();

    return identity;
  }
}
