import { IIdentityAccountProps } from "./identity-account-props.interface";
import { CredentialsManager } from "../CredentialsManager/credentials-manager";
import {
  Account,
  MethodContent,
  MethodScope,
  RevocationBitmap,
  DID,
  Document,
} from "@iota/identity-wasm/node";
import { Fragment } from "../identity-manager.types";
import {
  EncryptionFragment,
  RevocationFragment,
} from "../constants/fragment.constants";

/**
 * Utitlity class to bind wrapper methods to an Identity Instance
 */

export class IdentityAccount {
  account: Account;
  credentials: CredentialsManager;

  static async build(props: IIdentityAccountProps) {
    const identityAccount = new IdentityAccount();
    identityAccount.credentials = await CredentialsManager.build({
      account: props.account,
      store: props.store,
    });
    identityAccount.account = props.account;
    return identityAccount;
  }

  /**
   * Get the DID associated to the account
   *
   * @returns {DID}
   */

  getDid(): DID {
    return this.account.did();
  }

  /**
   * Get the Document associated to the Account
   */
  getDocument(): Document {
    return this.account.document();
  }

  /**
   * Manipulate a DID and attach a verification method to it
   *
   * @param {Fragment} fragment
   * @returns {Promise<void>}
   */

  async attachSigningMethod(fragment: Fragment): Promise<void> {
    await this.account.createMethod({
      content: MethodContent.GenerateEd25519(),
      fragment,
    });
    const revocationBitmap = new RevocationBitmap();
    await this.account.createService({
      fragment: RevocationFragment,
      type: RevocationBitmap.type(),
      endpoint: revocationBitmap.toEndpoint(),
    });
    await this.account.publish();
  }

  /**
   * Manipulate the DID and attach an encryption method to it
   *
   * @param {Fragment} fragment - fragment for the encryption method
   * @returns {Promise<void>}
   */

  async attachEncryptionMethod(): Promise<void> {
    await this.account.createMethod({
      fragment: EncryptionFragment,
      scope: MethodScope.KeyAgreement(),
      content: MethodContent.GenerateX25519(),
    });
    await this.account.publish();
  }
}
