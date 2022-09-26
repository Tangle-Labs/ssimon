import { Account } from "@iota/identity-wasm/node";
import {
  DecryptMethod,
  EncryptMethod,
  IStorageDriverProps,
  StorageDriver,
} from "./storage-driver.types";
import { Types } from "./storage-driver.types.interface";

/**
 * Create a new storage driver
 *
 * @param {StorageDriverProps<T> } props
 * @returns {Promise<StorageDriver>}
 */
export async function buildStorageDriver(
  props: IStorageDriverProps,
  encryptMethod: EncryptMethod,
  decryptMethod: DecryptMethod,
  account: Account
): Promise<StorageDriver> {
  const { type, options } = props;
  return type.newInstance(
    { ...options },
    encryptMethod,
    decryptMethod,
    account
  );
}
