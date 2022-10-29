import {
  Credential,
  ResolvedDocument,
  CredentialValidator,
  CredentialValidationOptions,
  FailFast,
  Resolver,
} from "@iota/identity-wasm/node";
import { resolveTxt } from "dns/promises";
import { clientConfig } from "../client-config";

/**
 * Validate a credential
 *
 * @param {Credential} signedVc - signed VC that needs to be validated
 * @param {ResolvedDocument} issuerIdentity - account it was signed with
 * @returns {Promise<boolean>}
 */

export async function isCredentialValid(
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
 * @returns {{ vc: boolean, dvid: boolean}}
 */

export async function verifyCredential(
  signedVc: Credential
): Promise<{ vc: boolean; dvid: boolean }> {
  const resolver = await Resolver.builder().clientConfig(clientConfig).build();
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
  const resolvedDocument = await resolver.resolve(didTag);

  if (!resolvedDocument) {
    const resolvedIdentity = await resolver.resolve(
      signedVc.issuer() as string
    );
    return {
      dvid: false,
      vc: await isCredentialValid(signedVc, resolvedIdentity),
    };
  }

  const vcIntegrity = await isCredentialValid(signedVc, resolvedDocument);
  return {
    dvid: true,
    vc: vcIntegrity,
  };
}
