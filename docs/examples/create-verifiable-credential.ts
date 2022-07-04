import { IdentityManager } from "identity-manager";

async function run() {
  // Instantiate a new instance of Identity Manager
  const manager = IdentityManager.newInstance({
    filepath: process.env.FILEPATH,
    password: process.env.PASSWORD,
  });

  // Create a did with the alias of `identity-alias`
  const did = await manager.createDid("identity-alias");

  // Attach a signature method to the newly created DID
  await did.attachSigningMethod("#signing-method");

  // create a VC and issue it
  const vc = await did.credentials.create({
    keyIndex: 0,
    id: "http://xyz.org/vc/123",
    type: "UniversityDegreeCredential",
    recipientDid: "did:iota:123...",
    fragment: "#signing-method",
    body: {
      name: "Alice",
      gpa: 4.0,
    },
  });
}

run();
