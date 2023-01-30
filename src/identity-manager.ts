import {
  CreateDidProps,
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
    const { adapter, storage, password } = options;
    const manager = new IdentityManager();
    manager.networkAdapter = await adapter.build();
    manager.storage = await storage.store.build({ ...storage.props, password });
    return manager;
  }

  public async getDid(props: {
    did?: string;
    alias?: string;
  }): Promise<IdentityAccount> {
    const config = await this.storage.findOne(props);
    if (!config) throw new Error("Unable to find DID");
    const { identity } = await this.networkAdapter.deserializeDid(config);
    return identity;
  }

  public async createDid(props: CreateDidProps): Promise<IdentityAccount> {
    if (await this.storage.findOne({ alias: props.alias }))
      throw new Error("Alias already exists");
    const { identity, seed } = await this.networkAdapter.createDid(props.seed);
    const config: IdentityConfig = {
      did: identity.getDid(),
      document: identity.getDocument(),
      alias: props.alias,
      store: {},
      seed,
    };
    if (await this.storage.findOne({ did: config.did }))
      throw new Error("Did already exists");
    await this.storage.create(config);

    return identity;
  }
}
