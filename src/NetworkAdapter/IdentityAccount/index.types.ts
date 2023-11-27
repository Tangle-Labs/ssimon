import { StorageSpec } from "../../Storage/index.types";
import { CredentialsManager } from "../CredentialsManager/index.types";

export type IdentityAccountProps<
  T extends StorageSpec<Record<string, any>, any>
> = {
  seed: string;
  isOld: boolean;
  alias: string;
  store: T;
  extras?: any;
};

export declare class IdentityAccount {
  credentials: CredentialsManager<StorageSpec<Record<string, any>, any>>;

  /**
   * INTERNAL ONLY, USED ONLY BY ADAPTER CODE
   *
   * Create a new IdentityAccount, this is used internally by adapters only
   *
   * @param {IdentityAccountProps} props
   * @returns Promise<IdentityAccount>
   */

  public static build(
    props: IdentityAccountProps<StorageSpec<Record<string, any>, any>>
  ): Promise<IdentityAccount>;

  /**
   * Get a did identifier (did:foobar:fj438r84jt859t959t)
   *
   * @returns {string}
   */

  public getDid(): string;

  /**
   * Get the full DID Document
   *
   * @returns {Record<string, any>}
   */

  public getDocument(): Record<string, any>;

  /**
   * Create a verifiable presentation from the credentials passed
   *
   * @param {string[]} credentials
   * @returns {Promise<Record<string, any>>}
   */
  public createPresentation(
    credentials: string[]
  ): Promise<Record<string, any>>;
}
