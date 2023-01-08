import { AccountBuilder, DID } from "@iota/identity-wasm/node";
import { Stronghold } from "@iota/identity-stronghold-nodejs";
import { clientConfig } from "./client-config";
import { IdentityAccount } from "./IdentityAccount/identity-account";
import * as path from "path";
import { readFile, writeFile } from "fs/promises";
import {
  ICreateDidProps,
  IManagerBackup,
  IIdentityManagerProps,
  IdentityConfig,
} from "./identity-manager.types";
import { Types } from "./StorageDriver/drivers/storage-driver.types.interface";
import { FsStorageDriver } from "./StorageDriver/drivers/fs-driver/fs-driver";
import { MongoStorageDriver } from "./StorageDriver/drivers/mongo-driver/mongo-driver";
import { decrypt, encrypt } from "./utils/crypto";
import { ConfigAdapter } from "./Adapters/ConfigAdapter";
import { config } from "process";

/**
 * IdentityManager is a utility class which handles management of secrets and
 * DID documents stored inside of one stronghold backup, private constructor needs
 * a path and password
 */

export class IdentityManager {
  builder: AccountBuilder;
  filepath: string;
  password: string;
  managerAlias: string;
  configAdapter: ConfigAdapter;

  /**
   * Constructor to create an instance of the class
   *
   * @param {String} filepath
   * @param {String} password
   */

  private constructor(
    filepath: string,
    password: string,
    managerAlias: string,
    configAdapter: typeof ConfigAdapter = ConfigAdapter
  ) {
    this.filepath = filepath;
    this.password = password;
    this.managerAlias = managerAlias;
    this.configAdapter = new configAdapter(filepath, managerAlias);
  }

  /**
   * Get the instance of IdentityManager, it will create a new instance of the class
   * shall one not already exist
   *
   * @param {IIdentityManagerProps} props
   * @returns {Promise<IdentityManager>}
   */

  static async newInstance(
    props: IIdentityManagerProps
  ): Promise<IdentityManager> {
    const { filepath, password, managerAlias, configAdapter } = props;

    const identityManager = new IdentityManager(
      filepath,
      password,
      managerAlias,
      configAdapter
    );
    const strongholdPath = path.resolve(
      __dirname,
      filepath,
      `${managerAlias}.stronghold`
    );

    const storage = await Stronghold.build(strongholdPath, password);

    const autopublish = false;

    const builder = new AccountBuilder({
      storage,
      clientConfig,
      autopublish,
    });

    identityManager.builder = builder;
    return identityManager;
  }

  /**
   * Get the IdentityConfig document stored on a JSON
   *
   * @returns {Promise<IdentityConfig[]>}
   */

  /**
   * Get config of a did by the did tag
   *
   * @param {DID} did - tag of the did to fetch
   * @returns {Promise<IdentityConfig>}
   */
  private async getIdentityConfigByDid(did: DID): Promise<IdentityConfig> {
    const configs = await this.configAdapter.getIdentityConfig();
    const config = configs.find((c: IdentityConfig) => c.did === did);
    config.store.type =
      config.store.type === "FS"
        ? FsStorageDriver
        : config.store.type === "Mongo"
        ? MongoStorageDriver
        : config.store.type;

    return config;
  }

  /**
   * Get config of a did by the did alias
   *
   * @param {DID} did - tag of the did to fetch
   * @returns {Promise<IdentityConfig>}
   */
  private async getIdentityConfigByAlias(
    alias: string
  ): Promise<IdentityConfig> {
    const configs = await this.configAdapter.getIdentityConfig();
    const config = configs.find((c: IdentityConfig) => c.alias === alias);
    config.store.type =
      config.store.type === "FS"
        ? FsStorageDriver
        : config.store.type === "Mongo"
        ? MongoStorageDriver
        : config.store.type;

    return config;
  }

  /**
   * Load a DID stored in the same stronghold path as the one configured
   *
   * @param {DID} did
   * @returns {Promise<IdentityAccount>}
   */

  async getDid(did: DID): Promise<IdentityAccount> {
    const { store } = await this.getIdentityConfigByDid(did);
    const account = await this.builder.loadIdentity(did);
    return await IdentityAccount.build({ account, store });
  }
  /**
   * Create a new DID in the stronghold path as the one configured
   *
   * @param {IIdentityManagerProps} props - Alias for the identity
   * @returns {Promise<IdentityAccount>}
   */

  async createDid(props: ICreateDidProps): Promise<IdentityAccount> {
    const { alias, store } = props;
    const account = await this.builder.createIdentity();
    await account.publish();
    let identities: IdentityConfig[] = [];
    const document = account.document();
    const did = account.did();
    const identityPath = path.resolve(
      __dirname,
      this.filepath,
      `${this.managerAlias}-config.json`
    );
    identities = await this.configAdapter.getIdentityConfig();
    const aliasExists = identities.find(
      (i: IdentityConfig) => i.alias === alias
    );
    if (aliasExists) {
      throw new Error(`Alias \`${alias}\` already in use`);
    }
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any

    const storeCopy = {
      ...store,
      type:
        store.type === Types.Fs
          ? "FS"
          : store.type === Types.Mongo
          ? "Mongo"
          : store.type,
    };
    const identity = {
      alias,
      document,
      did,
      store: storeCopy,
    };
    await this.configAdapter.saveIdentityConfig(identity).catch(() => {
      throw new Error("Unable to write IdentityConfig");
    });
    return await IdentityAccount.build({ account, store });
  }

  /**
   * Gets an account by the alias stored in the config
   *
   * @param alias
   * @returns {Promise<IdentityAccount>}
   */

  async getIdentityByAlias(alias: string): Promise<IdentityAccount> {
    const identity = await this.getIdentityConfigByAlias(alias);
    if (!identity) throw new Error("Identity not found");
    const account = await this.builder.loadIdentity(DID.fromJSON(identity.did));
    return await IdentityAccount.build({ account, store: identity.store });
  }

  /**
   * Create a backup of the identity manager with all of the identities stored
   * in the same vault
   *
   * @param {string} password - password to stronghold
   * @returns {Promise<IManagerBackup>}
   */
  async createBackup(password: string): Promise<IManagerBackup> {
    const strongholdPath = path.resolve(
      __dirname,
      this.filepath,
      `${this.managerAlias}.stronghold`
    );

    const stronghold = (await readFile(strongholdPath)).toString();
    const config = await this.configAdapter.getIdentityConfig();
    const credentials = await Promise.all(
      config.map(async (config: IdentityConfig) => {
        const identity = await this.getIdentityByAlias(config.alias);
        const creds = await identity.credentials.store.findAll();
        return { alias: creds };
      })
    );

    const backup = {
      stronghold: encrypt(stronghold, password),
      config: encrypt(JSON.stringify(config), password),
      credentials: encrypt(JSON.stringify(credentials), password),
    };
    return backup;
  }

  /**
   * Take a `IManagerBackup` and then use it to restore identity manager to a
   * version and restore all the identities
   */
  static async restoreFromBackup(
    backup: IManagerBackup,
    password: string,
    filepath: string,
    managerAlias: string
  ) {
    const credAccounts =
      decrypt(backup.credentials, password) !== ""
        ? JSON.parse(decrypt(backup.credentials, password))
        : [];
    const configsRaw: IdentityConfig[] = JSON.parse(
      decrypt(backup.config, password)
    );
    const stronghold = decrypt(backup.stronghold, password);

    await writeFile(
      path.resolve(__dirname, filepath, `${managerAlias}.stronghold`),
      stronghold
    );

    const configs = configsRaw.map((c) => {
      return {
        ...c,
        store: {
          type: Types.Fs,
          options: {
            filepath: `${c.alias}`,
          },
        },
      };
    });
    await writeFile(
      path.resolve(__dirname, filepath, `${managerAlias}-config.json`),
      JSON.stringify(configs)
    );

    const identityManager = new IdentityManager(
      filepath,
      password,
      managerAlias
    );
    const strongholdPath = path.resolve(
      __dirname,
      filepath,
      `${managerAlias}.stronghold`
    );

    const storage = await Stronghold.build(strongholdPath, password);

    const autopublish = false;

    const builder = new AccountBuilder({
      storage,
      clientConfig,
      autopublish,
    });

    identityManager.builder = builder;

    for (const credAccount of Object.keys(credAccounts)) {
      const did = await identityManager.getIdentityByAlias(credAccount);
      for (const cred of credAccounts[credAccount]) {
        did.credentials.store.newCredential(cred);
      }
    }
    return identityManager;
  }
}
