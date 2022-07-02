import {
  Account,
  Credential,
  CredentialValidationOptions,
  CredentialValidator,
  FailFast,
  ProofOptions,
  ResolvedDocument,
  Resolver,
  RevocationBitmap,
} from "@iota/identity-wasm/node";
import { resolveTxt } from "dns/promises";
import { clientConfig } from "../client-config";
import { Fragment } from "../identity-manager.types";
import { ICreateCredentialProps } from "./create-credential-props.interface";

/**
 * Credentials Manager is a helper class which contains all the abstractions for creating
 * new credentials, DVID and revokation of credentials
 */

export class CredentialsManager {
  resolver: Resolver;
  account: Account;
  revocationEndpoint: Fragment;

  constructor(account: Account, revocationEndpoint: Fragment) {
    this.resolver = new Resolver();
    this.account = account;
    this.revocationEndpoint = revocationEndpoint;
    this.buildResolver();
  }

  private async buildResolver() {
    this.resolver = await Resolver.builder().clientConfig(clientConfig).build();
  }

  /**
   * Create and issue a verifiable credential for someone
   *
   * @param {ICreateCredentialProps} props
   * @returns {Promise<Credential>}
   */

  async create(props: ICreateCredentialProps): Promise<Credential> {
    const { id, recipientDid, body, type, fragment, keyIndex } = props;

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
    try {
      CredentialValidator.validate(
        signedVc,
        issuerIdentity,
        CredentialValidationOptions.default(),
        FailFast.AllErrors
      );
    } catch (error) {
      return false;
    }
    return true;
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
   * @returns {IVerificationResult}
   */

  async verifyCredential(signedVc: Credential): Promise<boolean> {
    const domain = signedVc
      .toJSON()
      .id.split(/(https|http):\/\//)[2]
      .split("/")[0];
    const txtRecords = await resolveTxt(domain);
    const didRecord = txtRecords.find((record) =>
      record[0].includes("DVID.did=")
    );
    if (!didRecord) throw new Error("DVID Record not found");
    const didTag = didRecord[0].split("DVID.did=")[1];
    const resolvedDocument = await this.resolver.resolve(didTag);

    return this.isCredentialValid(signedVc, resolvedDocument);
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
}
