import {
  IdentityConfig,
  IdentityManagerOptions,
  IdentityManagerSpec,
} from "./identity-manager.types";
import { IdentityAccount } from "./NetworkAdapter/IdentityAccount/index.types";
import { CreateDidProps, NetworkAdapter } from "./NetworkAdapter/index.types";
import { StorageSpec } from "./Storage/index.types";

export class IdentityManager<T extends IdentityAccount>
  implements IdentityManagerSpec<T>
{
  networkAdapter: NetworkAdapter;
  storage: StorageSpec<IdentityConfig, IdentityConfig>;

  /**
   * Create a new Identity manager instance
   * store being passed here will be used to store keys and config
   *
   * @param {IdentityManagerOptions} options
   * @returns Promise<IdentityManager>
   */

  public static async build(
    options: IdentityManagerOptions<StorageSpec<any, any>>
  ) {
    const { adapter, storage } = options;
    const manager = new IdentityManager();
    manager.storage = storage;
    manager.networkAdapter = await adapter.build({ driver: manager.storage });
    return manager;
  }

  /**
   * Get an existing DID from the storage, by either alias or the did identifier
   * store being passed here is going to be used to store credentials, hence
   * each DID should have a separate store to ensure separation of data
   *
   * @param props {{ did: string, alias: string, store: T }}
   * @returns Promise<IdentityAccount>
   */

  public async getDid<T extends StorageSpec<Record<string, any>, any>>(props: {
    did?: string;
    alias?: string;
    store: T;
  }): Promise<IdentityAccount> {
    const config = await this.storage.findOne({
      did: props.did,
      alias: props.alias,
    });
    if (!config) throw new Error("Unable to find DID");
    const { identity } = await this.networkAdapter.deserializeDid(
      config,
      props.store
    );
    return identity;
  }

  /**
   * Create a new DID with a specific alias
   * store being passed here is going to be used to store credentials, hence
   * each DID should have a separate store to ensure separation of data
   *
   * @param {CreateDidProps} props
   * @returns Promise<IdentityAccount>
   */

  public async createDid<T extends StorageSpec<Record<string, any>, any>>(
    props: CreateDidProps<T>
  ): Promise<IdentityAccount> {
    if (await this.storage.findOne({ alias: props.alias }))
      throw new Error("Alias already exists");
    await this.storage.create({ alias: props.alias });
    const { identity, seed } = await this.networkAdapter.createDid(props);

    await this.storage.findOneAndUpdate({ alias: props.alias }, { seed });

    return identity;
  }
}
