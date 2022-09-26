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
