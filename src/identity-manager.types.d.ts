import { IStorageDriverProps } from "./StorageDriver/drivers/storage-driver.types";
import { DID, Document } from "@iota/identity-wasm/node";
import { IStorageDriverProps } from "./StorageDriver/drivers/storage-driver.types";
import { ConfigAdapter } from "./Adapters/ConfigAdapter";

export type IdentityConfig = {
  alias: string;
  document: Document;
  did: DID;
  store: IStorageDriverProps;
};

/**
 * Fragment type for IOTA Identity Fragments
 * example: #my-signing-method
 */
export type Fragment = `#${string}`;

export interface ICreateDidProps {
  alias: string;
  store: IStorageDriverProps;
}

type HashedString = {
  iv: string;
  content: string;
};

/**
 * Interface for the backup props
 */
export interface IManagerBackup {
  stronghold: HashedString;
  config: HashedString;
  credentials: HashedString;
}

export interface IIdentityManagerProps {
  /**
   * Filepath to store stronghold file at
   */
  filepath: string;

  /**
   * Password for the stronghold file
   */
  password: string;

  /**
   * Identity Manager alias, alias will be used to create the stronghold file
   * and config
   */
  managerAlias: string;

  /**
   * Adapter for the identity config
   */
  configAdapter?: typeof ConfigAdapter;
}
