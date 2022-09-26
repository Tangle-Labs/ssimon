import { IStorageDriverProps } from "./StorageDriver/drivers/storage-driver.types";

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
