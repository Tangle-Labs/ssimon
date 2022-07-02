import { Account } from "@iota/identity-wasm/node";

export interface IIdentityAccountProps {
  /**
   * Account for the DID to be bound to the IdentityAccount
   */
  account: Account;
}
