import { Issuer } from "@iota/identity-wasm/node";
import { PathLike } from "fs";
import { Fragment } from "../../identity-manager.types";
import { IdentityAccount } from "../../IdentityAccount/identity-account";
import { FsStorageDriver } from "./fs-driver/fs-driver";
import { FsOptions } from "./fs-driver/fs-driver.types";
import { MongoOptions } from "./mongo-driver/mongo-driver.types";
import { MongoStorageDriver } from "./mongo-driver/mongo-driver";
import { Types } from "./storage-driver.types.interface";

/**
 * Props for `MongoStorageDriver`
 */
interface MongoOptions {
  mongouri: string;
}

/**
 * Combined type for FS Driver
 */
export interface IFsProps {
  type: Types.Fs;
  options: FsOptions;
}

/**
 * Combined type for FS Driver
 */
export interface IMongoProps {
  type: Types.Mongo;
  options: MongoOptions;
}

/**
 * All implemented Storage Driver Types
 */

export type StorageDriver = MongoStorageDriver | FsStorageDriver;
export type IStorageDriverProps = IFsDriverProps | IMongoProps;

/**
 * Spec for a stored VC schema
 */
export interface IStoredVc {
  /*
   * Id of the credential
   */
  id: string;

  /**
   * Issuing DID of the credential
   */
  issuer: string | Issuer;

  /**
   * Type of the credential
   */
  type: string[];

  /**
   * Encrypted Credential
   */
  credential: Record<string, unknown>;
}

/**
 * Base props all storage drivers will need
 */
export interface IBaseStorageDriverProps {
  /**
   * Fragment to encrypt credentials with
   */

  fragment: Fragment;
}
