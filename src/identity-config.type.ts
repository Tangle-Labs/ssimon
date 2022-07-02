import { DID, Document } from "@iota/identity-wasm/node";

export type IdentityConfig = {
  alias: string;
  document: Document;
  did: DID;
};
