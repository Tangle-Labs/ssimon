import { IStorageDriverProps, StorageDriver } from "./storage-driver.types";

/**
 * Create a new storage driver
 *
 * @param {StorageDriverProps<T> } props
 * @returns {Promise<StorageDriver>}
 */
export async function buildStorageDriver(
  props: IStorageDriverProps
): Promise<StorageDriver> {
  const { type, options } = props;
  return type.newInstance({ ...options });
}
