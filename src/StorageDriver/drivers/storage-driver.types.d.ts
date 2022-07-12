import { Issuer } from "@iota/identity-wasm/node";

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
