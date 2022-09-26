import { DID, Document } from "@iota/identity-wasm/node";
import { IStorageDriverProps } from "./StorageDriver/drivers/storage-driver.types";

export type IdentityConfig = {
  alias: string;
  document: Document;
  did: DID;
  store: IStorageDriverProps;
};
