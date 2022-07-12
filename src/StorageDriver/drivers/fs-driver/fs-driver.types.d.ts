import { PathLike } from "fs";
import { Fragment } from "../../../identity-manager.types";
import { IdentityAccount } from "../../../IdentityAccount/identity-account";

export interface IFsDriverProps {
  /**
   * FilePath for the JSON where credentials shall be stored
   */
  filepath: JsonPath;

  /**
   * `IdentityAccount` to sign data with
   */
  identityAccount: IdentityAccount;

  /**
   * Fragment of encryption method
   */
  fragment: Fragment;
}

export type JsonPath = `${PathLike}.json`;
