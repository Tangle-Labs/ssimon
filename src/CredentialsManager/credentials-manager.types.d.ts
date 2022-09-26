import { Fragment } from "../identity-manager.types";
import { StorageDriverProps } from "../StorageDriver/drivers/storage-driver.types";

export interface ICreateCredentialProps {
  /**
   * Index of the key to sign the credential with
   */
  keyIndex: number;

  /**
   * id of the credential, compliant to the w3c standard
   */
  id: string;

  /**
   * Type of the credential issued, example `UniversityDegreeCredential`
   */
  type: string;

  /**
   * Fragment to sign with
   */
  fragment: Fragment;

  /**
   * DID Identifier of the recipient
   */
  recipientDid: string;

  /**
   * Body of the credential data to be signed
   */
  body: Record<string, unknown>;
}

export interface ICredentialManagerProps {
  account: Account;
  store: StorageDriverProps;
}
