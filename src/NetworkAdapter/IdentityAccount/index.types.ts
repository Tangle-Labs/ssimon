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

  public static build(): Promise<IdentityAccount>;

  public getDid(): string;

  public getDocument(): Record<string, any>;
}
