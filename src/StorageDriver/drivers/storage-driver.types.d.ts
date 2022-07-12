import { Issuer } from "@iota/identity-wasm/node";
import { Fragment } from "../../identity-manager.types";
import { IdentityAccount } from "../../IdentityAccount/identity-account";

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

export interface IBaseStorageDriverProps {
  /**
   * Fragment to encrypt credentials with
   */
  fragment: Fragment;

  /**
   * account to use to encrypt those credentials
   */
  account: IdentityAccount;
}
