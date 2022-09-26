import { Account } from "@iota/identity-wasm/node";
import { Fragment } from "../identity-manager.types";
import { IStorageDriverProps } from "../StorageDriver/drivers/storage-driver.types";

export interface IIdentityAccountProps {
  /**
   * Account for the DID to be bound to the IdentityAccount
   */
  account: Account;

  /**
   * store options
   */
  store: IStorageDriverProps;
}
