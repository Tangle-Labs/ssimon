import {
  IdentityConfig,
  IdentityManagerOptions,
  IdentityManagerSpec,
} from "./identity-manager.types";
import { CredentialsStorageDriverSpec } from "./NetworkAdapter/CredentialsManager/CredentialsStorageDriver/index.types";
import { IdentityAccount } from "./NetworkAdapter/IdentityAccount/index.types";
import { CreateDidProps, NetworkAdapter } from "./NetworkAdapter/index.types";
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
    manager.storage = await storage.store.build({ ...storage.props, password });
    manager.networkAdapter = await adapter.build({ driver: manager.storage });
    return manager;
  }

  public async getDid<
    T extends CredentialsStorageDriverSpec<Record<string, any>, any>
  >(props: {
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

  public async createDid<
    T extends CredentialsStorageDriverSpec<Record<string, any>, any>
  >(props: CreateDidProps<T>): Promise<IdentityAccount> {
    if (await this.storage.findOne({ alias: props.alias }))
      throw new Error("Alias already exists");
    await this.storage.create({ alias: props.alias });
    const { identity, seed } = await this.networkAdapter.createDid(props);

    console.log("this messes up?");
    await this.storage.findOneAndUpdate({ alias: props.alias }, { seed });
    console.log("no it doesn't you bozo");

    return identity;
  }
}
