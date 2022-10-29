import {
  Account,
  AgreementInfo,
  CekAlgorithm,
  Credential,
  EncryptedData,
  EncryptionAlgorithm,
  ProofOptions,
  ResolvedDocument,
  RevocationBitmap,
} from "@iota/identity-wasm/node";
import { clientConfig } from "../client-config";
import {
  EncryptionFragment,
  RevocationFragment,
} from "../constants/fragment.constants";
import { Fragment } from "../identity-manager.types";
import { IdentityAccount } from "../IdentityAccount/identity-account";
import { buildStorageDriver } from "../StorageDriver/drivers/storage-driver";
import {
  StorageDriver,
  IStorageDriverProps,
} from "../StorageDriver/drivers/storage-driver.types";
import { isCredentialValid, verifyCredential } from "../utils";
import {
  ICreateCredentialProps,
  ICredentialManagerProps,
} from "./credentials-manager.types";

/**
 * Credentials Manager is a helper class which contains all the abstractions for creating
 * new credentials, DVID and revokation of credentials
 */

export class CredentialsManager {
  fragment: Fragment;
  account: Account;
  revocationEndpoint: Fragment;
  store: StorageDriver;

  private constructor(props: ICredentialManagerProps) {
    const { account } = props;
    this.account = account;
    this.revocationEndpoint = RevocationFragment;
  }

  static async build(props: ICredentialManagerProps) {
    const credentialsManager = new CredentialsManager(props);
    await credentialsManager.buildStore(props.store);
    return credentialsManager;
  }

  private async buildStore(props: IStorageDriverProps) {
    this.store = await buildStorageDriver(
      {
        ...props,
      },
      this.encryptData,
      this.decryptData,
      this.account
    );
  }

  /**
   * Validate a credential
   *
   * @param {Credential} signedVc - signed VC that needs to be validated
   * @param {ResolvedDocument} issuerIdentity - account it was signed with
   * @returns {Promise<boolean>}
   */
  async isCredentialValid(
    signedVc: Credential,
    issuerIdentity: ResolvedDocument
  ): Promise<boolean> {
    return isCredentialValid(signedVc, issuerIdentity);
  }

  /**
   * DVID v0.2.0
   * Domain Verifiable Identity is a module that allows you to verify the source of
   * origin for a verifiable credential, here are the steps to validate with DVID v0.2.0
   *
   * - Parse the Document and look for the domain of origin
   * - Lookup TXT records for the domain of origin
   * - Resolve DID contained in DNS record and validate the credential
   *
   * @param {Credential} signedVc
   * @returns {{ vc: boolean, dvid: boolean}}
   */

  async verifyCredential(
    signedVc: Credential
  ): Promise<{ vc: boolean; dvid: boolean }> {
    return verifyCredential(signedVc);
  }

  /**
   * Create and issue a verifiable credential for someone
   *
   * @param {ICreateCredentialProps} props
   * @returns {Promise<Credential>}
   */

  async create(props: ICreateCredentialProps): Promise<Credential> {
    const { id, recipientDid, fragment, body, type, keyIndex } = props;

    const credentialSubject = {
      id: recipientDid,
      ...body,
    };
    const issuer = this.account.document().id().toString();
    const unsignedCredential = new Credential({
      id,
      type,
      issuer,
      credentialSubject,
      credentialStatus: {
        id: this.account.did() + this.revocationEndpoint,
        type: RevocationBitmap.type(),
        revocationBitmapIndex: keyIndex.toString(),
      },
    });
    const signedVc = await this.account.createSignedCredential(
      fragment,
      unsignedCredential,
      ProofOptions.default()
    );

    return signedVc;
  }

  /**
   * Revoke a credential that has been issued, by revoking the method that was used to
   * sign the credential we are looking to revoke and make invalid.
   *
   * WARNING: it will revoke the method that was attached to the credential thus any other
   * credentials signed using this keypair will also become invalid
   *
   * @param {Number} keyIndex - Revoke the key at the index passed
   * @return {Promise<void>}
   */

  async revokeCredential(keyIndex: number): Promise<void> {
    await this.account.revokeCredentials(this.revocationEndpoint, keyIndex);
    await this.account.publish();
  }

  /**
   * Encrypt data and return it
   *
   * @param {String} plainText - data to be encrypted
   * @returns {Promise<EncryptedData>}
   */

  async encryptData(
    plainText: string,
    account = this.account
  ): Promise<EncryptedData> {
    const method = account.document().resolveMethod(EncryptionFragment);

    if (!method) throw new Error("Method not found");
    const publicKey = method.data().tryDecode();

    const agreementInfo = new AgreementInfo(
      new Uint8Array(0),
      new Uint8Array(0),
      new Uint8Array(0),
      new Uint8Array(0)
    );

    const encryptionAlgorithm = EncryptionAlgorithm.A256GCM();

    const cekAlgorithm = CekAlgorithm.EcdhEs(agreementInfo);
    const message = Buffer.from(plainText);
    const associatedData = Buffer.from("associatedData");

    const encryptedData = await this.account
      .encryptData(
        message,
        associatedData,
        encryptionAlgorithm,
        cekAlgorithm,
        publicKey
      )
      .catch((err) => {
        console.error(err);
      });

    if (!encryptedData) throw new Error("failed to encrypt data");
    return encryptedData;
  }

  /**
   * Decrypt the data
   *
   * @param {EncryptedData | JSON | Record<string, unknown>} encryptedData - data to decrypt
   * @returns {Promise<string>}
   */

  async decryptData(
    encryptedData: EncryptedData | JSON | Record<string, unknown>
  ): Promise<string> {
    encryptedData =
      encryptedData instanceof EncryptedData
        ? encryptedData
        : EncryptedData.fromJSON(encryptedData);

    const agreementInfo = new AgreementInfo(
      new Uint8Array(0),
      new Uint8Array(0),
      new Uint8Array(0),
      new Uint8Array(0)
    );
    const encryptionAlgorithm = EncryptionAlgorithm.A256GCM();

    const cekAlgorithm = CekAlgorithm.EcdhEs(agreementInfo);
    const decryptedData = await this.account.decryptData(
      encryptedData,
      encryptionAlgorithm,
      cekAlgorithm,
      EncryptionFragment
    );

    const plainText = new TextDecoder().decode(decryptedData);

    return plainText;
  }
}
