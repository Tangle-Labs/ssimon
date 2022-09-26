import { cred1, cred2 } from "./sample-creds";
import { IdentityAccount, IdentityManager } from "../../";
import * as path from "path";
import * as fs from "fs";
import { Types } from "../../StorageDriver/drivers/storage-driver.types.interface";

const credsFilepath = path.resolve(__dirname, "../../../dist/creds.json");
const testingFilepath = path.resolve(__dirname, "../../../dist/");

function tryUnlinkFile(filepath: fs.PathLike) {
  try {
    fs.unlinkSync(filepath);
  } catch {
    null;
  }
}

tryUnlinkFile(credsFilepath);
tryUnlinkFile(`${testingFilepath}/fs-id-config.json`);
tryUnlinkFile(`${testingFilepath}/fs-id.stronghold`);

let did: IdentityAccount;

describe("fs-storage-driver", () => {
  test("should instantiate FsStorageDriver", async () => {
    const manager = await IdentityManager.newInstance({
      filepath: testingFilepath,
      password: "password",
      managerAlias: "fs-id",
    });

    did = await manager.createDid({
      alias: "new-did",
      store: {
        type: Types.Fs,
        options: {
          filepath: credsFilepath,
        },
      },
    });
    await did.attachEncryptionMethod();
  });

  test("should save new credential", async () => {
    await did.credentials.store.newCredential(cred1);
    await did.credentials.store.newCredential(cred2);
  });

  test("should throw error on duplicate credential", async () => {
    await expect(
      did.credentials.store.newCredential(cred1)
    ).rejects.toThrowError();
  });

  test("should find credential by id", async () => {
    const id = cred2.id() as string;
    const cred = await did.credentials.store.findById(id);
    expect(cred2.toJSON()).toEqual(cred.toJSON());
  });

  test("should find all credentials by Type", async () => {
    const creds = await did.credentials.store.findByCredentialType(
      "UniversityDegreeCredential"
    );
    expect(creds.length).toEqual(2);
  });

  test("should find 0 credentials by incorrect Type", async () => {
    const creds = await did.credentials.store.findByCredentialType(
      "NotAUniversityDegreeCredential"
    );
    expect(creds.length).toEqual(0);
  });

  test("should find credentials by issuer", async () => {
    const issuer = cred2.issuer() as string;
    const creds = await did.credentials.store.findByIssuer(issuer);
    expect(creds.length).toEqual(1);
  });

  test("should delete a credential by ID", async () => {
    const id = cred2.id() as string;
    await did.credentials.store.delete(id);
    const creds = await did.credentials.store.findAll();
    expect(creds[0].toJSON()).toEqual(cred1.toJSON());
    await expect(did.credentials.store.findById(id)).rejects.toThrow();
  });
});
