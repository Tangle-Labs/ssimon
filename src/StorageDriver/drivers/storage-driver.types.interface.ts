import { FsStorageDriver } from "./fs-driver/fs-driver";
import { MongoStorageDriver } from "./mongo-driver/mongo-driver";

/**
 * Enum for implemented storage driver enums
 */
export const Types = {
  Fs: FsStorageDriver,
  Mongo: MongoStorageDriver,
};
