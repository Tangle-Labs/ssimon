import { IdentityManager } from "identity-manager";

async function run() {
  // Instantiate a new instance of Identity Manager
  const manager = IdentityManager.newInstance({
    filepath: process.env.FILEPATH,
    password: process.env.PASSWORD,
  });

  // Create a did with the alias of `identity-alias`
  const did = await manager.createDid("identity-alias");

  // get the newly created identity by alias
  const loadedDid = await manager.getIdentityByAlias("identity-alias");
}

run();
