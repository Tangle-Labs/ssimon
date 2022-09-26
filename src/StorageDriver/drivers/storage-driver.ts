import {
  IBaseStorageDriverProps,
  IStorageDriverProps,
  StorageDriver,
} from "./storage-driver.types";

/**
 * Create a new storage driver
 *
 * @param {StorageDriverProps<T> & IBaseStorageDriverProps} props
 * @returns {Promise<StorageDriver>}
 */
export async function buildStorageDriver(
  props: IStorageDriverProps & IBaseStorageDriverProps
): Promise<StorageDriver> {
  const { type, options, fragment } = props;
  return type.newInstance({ ...options, fragment });
}
